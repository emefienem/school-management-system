const Stripe = require("stripe");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const stripe = new Stripe(process.env.STRIP_SECRET_KEY, {
  apiVersion: "2022-11-15",
});

const feeCtrl = {
  setFee: async (req, res) => {
    try {
      const { duration, amount, adminID } = req.body;

      const feeStructure = await prisma.feeStructure.create({
        data: {
          duration,
          amount,
          duration: Number(duration),
          amount: Number(amount),
          school: {
            connect: { id: adminID },
          },
        },
      });

      return res.status(201).json(feeStructure);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  processFee: async (req, res) => {
    try {
      const { rollNum, amount, paymentType } = req.body;

      const student = await prisma.student.findUnique({
        where: { rollNum: Number(rollNum) },
        include: { fees: { include: { feeStructure: true } } },
      });

      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }

      const totalFee = student.fees.reduce((acc, fee) => {
        return acc + fee.feeStructure.amount;
      }, 0);

      const totalPaid = student.fees.reduce((acc, fee) => {
        return acc + (fee.isPaid ? fee.amount : fee.totalPaid || 0);
      }, 0);

      const outstandingAmount = totalFee - totalPaid;

      if (paymentType === "partial" && amount > outstandingAmount) {
        return res.status(400).json({
          message: `You cannot pay more than the outstanding fee. Outstanding amount: ${outstandingAmount}`,
        });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100),
        currency: "usd",
        metadata: {
          rollNum,
          paymentType,
        },
      });

      const feeRecord = student.fees.find((fee) => !fee.isPaid);
      if (feeRecord) {
        if (paymentType === "full" && amount >= outstandingAmount) {
          feeRecord.isPaid = true;
          feeRecord.paymentDate = new Date();
        } else if (paymentType === "partial") {
          feeRecord.totalPaid = (feeRecord.totalPaid || 0) + amount;
          if (feeRecord.totalPaid >= feeRecord.amount) {
            feeRecord.isPaid = true;
            feeRecord.paymentDate = new Date();
          }
        }

        await prisma.fee.update({
          where: { id: feeRecord.id },
          data: {
            isPaid: feeRecord.isPaid,
            paymentDate: feeRecord.isPaid ? new Date() : null,
            totalPaid: feeRecord.totalPaid,
          },
        });
      }

      return res.status(200).json({ paymentIntent });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  getAllFeeStructures: async (req, res) => {
    try {
      const schoolId = parseInt(req.params.id);

      const feeStructures = await prisma.feeStructure.findMany({
        where: { schoolId: schoolId },
      });

      return res.status(200).json(feeStructures);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: error.message });
    }
  },

  // Student
  getFeeDetails: async (req, res) => {
    try {
      const { rollNum } = req.params;

      const student = await prisma.student.findUnique({
        where: { rollNum: Number(rollNum) },
        include: {
          fees: {
            include: { feeStructure: true }, // Include fee structure details
          },
        },
      });

      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }

      const feeDetails = student.fees.map((fee) => ({
        term: fee.feeStructure.term,
        amount: fee.amount,
        duration: fee.feeStructure.duration, // Fetch the duration
        isPaid: fee.isPaid,
        paymentDate: fee.paymentDate,
      }));

      return res.status(200).json(feeDetails);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  //   checkAndDisableAccounts: async () => {
  //     try {
  //       const unpaidFees = await prisma.fee.findMany({
  //         where: {
  //           isPaid: false,
  //           paymentDate: null,
  //         },
  //       });

  //       const studentIds = unpaidFees.map((fee) => fee.studentId);

  //       await prisma.student.updateMany({
  //         where: {
  //           id: {
  //             in: studentIds,
  //           },
  //         },
  //         data: {
  //           disabled: true,
  //         },
  //       });
  //     } catch (error) {
  //       return res.status(500).json({ message: error.message });
  //     }
  //   },
  // getUnpaidFees: async (req, res) => {
  //   try {
  //     const unpaidFees = await prisma.fee.findMany({
  //       where: {
  //         paid: false,
  //       },
  //     });

  //     res.send(unpaidFees);
  //   } catch (err) {
  //     res.status(500).json(err);
  //   }
  // },
};

module.exports = feeCtrl;

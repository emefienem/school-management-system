-- CreateTable
CREATE TABLE "Message" (
    "id" SERIAL NOT NULL,
    "senderEmail" TEXT NOT NULL,
    "receiverEmail" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

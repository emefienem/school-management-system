export const calculateSubjectAttendancePercentage = (
  presentCount,
  totalSessions
) => {
  if (totalSessions === 0 || presentCount === 0) {
    return 0;
  }
  const percentage = (presentCount / totalSessions) * 100;
  return percentage.toFixed(2);
};

export const groupAttendanceBySubject = (subjectAttendance) => {
  const attendanceBySubject = {};

  subjectAttendance.forEach((attendance) => {
    const subName = attendance.subName.subName;
    const sessions = attendance.sessions;
    const subId = attendance.subNameId;

    if (!attendanceBySubject[subName]) {
      attendanceBySubject[subName] = {
        present: 0,
        absent: 0,
        sessions: sessions,
        allData: [],
        subId: subId,
      };
    }
    if (attendance.status === "Present") {
      attendanceBySubject[subName].present++;
    } else if (attendance.status === "Absent") {
      attendanceBySubject[subName].absent++;
    }
    attendanceBySubject[subName].allData.push({
      date: attendance.date,
      status: attendance.status,
    });
  });
  return attendanceBySubject;
};

export const calculateOverallAttendancePercentage = (subjectAttendance) => {
  let totalSessionsSum = 0;
  let presentCountSum = 0;
  const uniqueSubIds = [];

  subjectAttendance.forEach((attendance) => {
    const subId = attendance.subNameId;
    if (!uniqueSubIds.includes(subId)) {
      const sessions = parseInt(attendance.sessions);
      totalSessionsSum += sessions;
      uniqueSubIds.push(subId);
    }
    presentCountSum += attendance.status === "Present" ? 1 : 0;
  });

  if (totalSessionsSum === 0 || presentCountSum === 0) {
    return 0;
  }

  return (presentCountSum / totalSessionsSum) * 100;
};

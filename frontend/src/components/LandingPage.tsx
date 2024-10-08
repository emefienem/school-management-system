// import React from "react";
// import { Link } from "react-router-dom";
// import Students from "../assets/student.svg";

// const Home = () => {
//   return (
//     <div className="flex justify-center items-center h-screen bg-gray-50">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div>
//           <img src={Students} alt="students" className="w-full" />
//         </div>

//         <div className="bg-white p-4 md:p-6 h-screen flex flex-col justify-center">
//           <h1 className="text-2xl md:text-4xl font-bold text-gray-800">
//             Welcome to
//             <br />
//             School Management
//             <br />
//             System
//           </h1>
//           <p className="mt-6 mb-6 text-gray-600">
//             Streamline school management, class organization, and add students
//             and faculty. Seamlessly track attendance, assess performance, and
//             provide feedback. Access records, view marks, and communicate
//             effortlessly.
//           </p>
//           <div className="flex flex-col items-center gap-4">
//             <Link to="/login" className="w-full">
//               <button className="bg-orange-600 text-white w-full py-2 rounded-lg hover:bg-orange-700">
//                 Login
//               </button>
//             </Link>

//             <p className="text-gray-600 mt-6">
//               Don't have an account?{" "}
//               <Link to="/signup" className="text-orange-700">
//                 Sign up
//               </Link>
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Home;

import React from "react";
import { Link } from "react-router-dom";
import Students from "../assets/student.svg";

const Home = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4">
          <img
            src={Students}
            alt="students"
            className="w-full max-w-xs mx-auto md:max-w-full"
          />
        </div>

        <div className="bg-white p-4 md:p-6 flex flex-col justify-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 text-center md:text-left">
            Welcome to
            <br />
            School Management
            <br />
            System
          </h1>
          <p className="mt-4 md:mt-6 mb-4 md:mb-6 text-gray-600 text-center md:text-left">
            Streamline school management, class organization, and add students
            and faculty. Seamlessly track attendance, assess performance, and
            provide feedback. Access records, view marks, and communicate
            effortlessly.
          </p>
          <div className="flex flex-col items-center gap-4">
            <Link to="/login" className="w-full">
              <button className="bg-orange-600 text-white w-full py-2 rounded-lg hover:bg-orange-700">
                Login
              </button>
            </Link>

            <p className="text-gray-600 mt-4 md:mt-6 text-center">
              Don't have an account?{" "}
              <Link to="/signup" className="text-orange-700">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

import { motion } from "framer-motion";

export default function TestPage() {
  return (
    <div>
      {/* ใช้ relative เพื่อให้รูปภาพทับกัน */}
      <div className="relative flex justify-center gap-6">
        {/* รูปแรกที่วิ่งมาจากซ้าย */}
        <motion.div
          initial={{ opacity: 0, x: -100, scale: 0.5 }} // เริ่มต้นจากซ้ายมือ และมีขนาดเล็ก
          animate={{ opacity: 1, x: 0, scale: 1 }} // วิ่งมาที่ตำแหน่งกลางและขยายขนาด
          whileHover={{ scale: 1.1 }} // เพิ่มขนาดเมื่อ hover
          transition={{
            duration: 1,
            type: "spring", // ใช้ spring animation สำหรับการเคลื่อนไหวที่เร็วและพุ่ง
            stiffness: 300, // ความตึงของสปริง
            damping: 10, // ค่าการลดแรงกระตุ้น
          }}
          className="absolute mr-3"
          style={{ zIndex: 1 }}
        >
          <img
            src="/images/merry/merry.svg" // ใส่ path ของภาพให้ถูกต้อง
            alt="example"
            className="rounded-lg"
          />
        </motion.div>

        {/* รูปที่สองที่วิ่งมาจากขวา */}
        <motion.div
          initial={{ opacity: 0, x: 100, scale: 0.5 }} // เริ่มต้นจากขวามือ และมีขนาดเล็ก
          animate={{ opacity: 1, x: 0, scale: 1 }} // วิ่งมาที่ตำแหน่งกลางและขยายขนาด
          whileHover={{ scale: 1.1 }} // เพิ่มขนาดเมื่อ hover
          transition={{
            duration: 1,
            type: "spring", // ใช้ spring animation สำหรับการเคลื่อนไหวที่เร็วและพุ่ง
            stiffness: 300, // ความตึงของสปริง
            damping: 10, // ค่าการลดแรงกระตุ้น
          }}
          className="absolute ml-8"
          style={{ zIndex: 1 }}
        >
          <img
            src="/images/merry/merry.svg" // ใส่ path ของภาพให้ถูกต้อง
            alt="example"
            className="rounded-lg"
          />
        </motion.div>

        {/* รูป Merry Match! ที่อยู่บนสุด */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }} // เริ่มต้นที่ขนาด 0
          animate={{
            opacity: 1,
            scale: 1,
            x: [0, 10, -10, 0], // เพิ่มการขยับไปทางซ้ายและขวาเล็กน้อย
          }} // ขยายขนาดจนเต็ม
          whileHover={{ scale: 1.1 }} // เพิ่มขนาดเมื่อ hover
          transition={{
            duration: 1,
            type: "spring", // ใช้ spring animation สำหรับการเคลื่อนไหวที่เร็วและพุ่ง
            stiffness: 300, // ความตึงของสปริง
            damping: 20, // ค่าการลดแรงกระตุ้น
          }}
          className="absolute mt-14"
          style={{ zIndex: 5 }}
        >
          <img
            src="/images/merry/Merry Match!.svg" // ใส่ path ของภาพให้ถูกต้อง
            alt="example"
            className="rounded-lg"
          />
        </motion.div>
      </div>
    </div>
    //////////////////// ใช้ loading /////////////////////////
    //   <div>
    //     {/* ใช้ relative เพื่อให้รูปภาพทับกัน */}
    //     <div className="relative flex h-screen items-center justify-center">
    //       {/* ภาพหมุนชั้นนอก */}
    //       <motion.div
    //         initial={{ scale: 0 }}
    //         animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
    //         transition={{
    //           duration: 2,
    //           repeat: Infinity,
    //           ease: "easeInOut",
    //         }}
    //         className="absolute"
    //       >
    //         <img
    //           src="/images/merry/merry.svg" // ใช้ path ของภาพที่ต้องการ
    //           alt="Outer Layer"
    //           className="h-64 w-64"
    //         />
    //       </motion.div>

    //       {/* ภาพหมุนชั้นกลาง */}
    //       <motion.div
    //         initial={{ scale: 0 }}
    //         animate={{
    //           scale: [1, 1.2, 1],
    //           opacity: [0.5, 1, 0.5],
    //           rotate: [0, 360],
    //         }}
    //         transition={{
    //           duration: 1.5,
    //           repeat: Infinity,
    //           ease: "easeInOut",
    //         }}
    //         className="absolute"
    //       >
    //         <img
    //           src="/images/merry/merry.svg" // ใช้ path ของภาพที่ต้องการ
    //           alt="Middle Layer"
    //           className="h-48 w-48"
    //         />
    //       </motion.div>

    //       {/* ภาพหมุนชั้นใน */}
    //       <motion.div
    //         initial={{ scale: 0 }}
    //         animate={{
    //           scale: [1, 1.1, 1],
    //           opacity: [0.5, 1, 0.5],
    //           rotate: [-360, 0],
    //         }}
    //         transition={{
    //           duration: 1,
    //           repeat: Infinity,
    //           ease: "easeInOut",
    //         }}
    //         className="absolute"
    //       >
    //         <img
    //           src="/images/merry/merry.svg" // ใช้ path ของภาพที่ต้องการ
    //           alt="Inner Layer"
    //           className="h-32 w-32"
    //         />
    //       </motion.div>

    //       {/* ภาพ Loading */}
    //       <motion.div
    //         initial={{ opacity: 0 }}
    //         animate={{ opacity: [0, 1, 0] }}
    //         transition={{
    //           duration: 2,
    //           repeat: Infinity,
    //           ease: "easeInOut",
    //         }}
    //         className="absolute mt-80"
    //       >
    //         <img
    //           src="/images/merry/Merry Match!.svg" // ใช้ path ของภาพที่ต้องการ
    //           alt="Loading Text"
    //           className="h-16"
    //         />
    //       </motion.div>
    //     </div>
    //   </div>
  );
}

import { AdminSideBar } from "@/components/admin/AdminSideBar";
import AdminHeader from "@/components/admin/AdminHeader";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import DeleteConfirmationModal from "@/components/admin/DeleteConfirmationModal";
import { jwtDecode } from "jwt-decode";
import { useAdminAuth } from "@/contexts/AdminAuthContext";

function MerryPackageAdd() {
  const router = useRouter(); // เรียกใช้ useRouter

  const [isModalOpen, setIsModalOpen] = useState(false); // Modal Open
  const [isModalValidation, setIsModalValidation] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [details, setDetails] = useState([{ id: 1, text: "" }]); // state สำหรับเก็บรายการ Detail โดยเริ่มต้นที่ 1 และ text = ""
  const [packageName, setPackageName] = useState("");
  const [merryLimit, setMerryLimit] = useState("");
  const [price, setPrice] = useState(0);
  const [authLoading, setAuthLoading] = useState(true);
  const [icon, setIcon] = useState(null);
  const { logout } = useAdminAuth(); // ดึง logout จาก Context
  const [isSaving, setIsSaving] = useState(false); // State สำหรับ Loading ขณะบันทึก
  const [validationErrors, setValidationErrors] = useState([]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setIcon(file);
    }
  };

  const handleRemoveIcon = () => {
    setIcon(null); // ลบรูปที่อัปโหลด
  };

  const handleAddPackage = async () => {
    try {
      setIsSaving(true); // เริ่มสถานะ Loading
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

      // Validation ข้อมูลก่อนส่ง
      if (!packageName || packageName.trim() === "") {
        // || details.length
        setModalMessage("Package name is required.");
        setIsModalValidation(true);
        setIsSaving(false);
        return;
      }

      if (!merryLimit) {
        setModalMessage("Merry limit is required."); // ข้อความที่จะปรากฏใน Modal
        setIsModalValidation(true); // เปิด Modal
        setIsSaving(false);
        return;
      }

      if (!price || isNaN(price) || price <= 0) {
        setModalMessage("price is required."); // ข้อความที่จะปรากฏใน Modal
        setIsModalValidation(true); // เปิด Modal
        setIsSaving(false);
        return;
      }

      if (!icon) {
        setModalMessage("Icon image is required.");
        setIsModalValidation(true);
        setIsSaving(false);
        return;
      }

      if (
        details.length === 0 ||
        details.every((detail) => detail.text.trim() === "")
      ) {
        setModalMessage("At least one valid detail is required.");
        setIsModalValidation(true);
        setIsSaving(false);
        return;
      }

      // ดึง Token จาก Local Storage หรือ Context
      const token = localStorage.getItem("adminToken");

      if (!token) {
        alert("You are not authenticated. Please log in.");
        setIsSaving(false);
        return;
      }

      // สร้าง FormData สำหรับส่งข้อมูล
      const formData = new FormData();
      formData.append("package_name", packageName);
      formData.append("merry_limit", merryLimit);
      formData.append("price", price);
      formData.append("details", JSON.stringify(details.map((d) => d.text))); // แปลง details เป็น JSON string
      if (icon) formData.append("icon", icon);

      // ส่งคำขอไปยัง API
      const res = await axios.post(
        `${apiBaseUrl}/api/admin/packages`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`, // ส่ง Token ใน Header
          },
        },
      );

      if (res.status === 201) {
        //alert("Package added successfully!"); // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
        setIsModalOpen(true);
        //resetForm(); // ล้างฟอร์มหลังจากสำเร็จ
        //router.push("/admin/merry-package-list");
      }
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "An unexpected error occurred.");
    } finally {
      setIsSaving(false); // ยกเลิกสถานะ Loading หลังจากทำงานเสร็จ
    }
  };

  // รีเซ็ตฟอร์ม
  const resetForm = () => {
    setPackageName("");
    setMerryLimit("");
    //setIcon(null);
    setPrice("");
    setDetails([{ id: 1, text: "" }]);
  };

  // addDetail Step2:
  // ใช้ setDetails เพื่อเพิ่ม object ใหม่ใน array ของ state : details
  // เพิ่ม Detail ใหม่
  const addDetail = () => {
    setDetails([...details, { id: details.length + 1, text: "" }]);
  };

  // deleteDetail Step3.3: เรียกใช้ setIsModalOpen เพื่อ false ปิดหน้า Modal
  const closeModal = () => {
    setIsModalOpen(false);
    setDetailToDelete(null);
    router.push("/admin/merry-package-list");
  };

  // updateDetail Step2: ใช้ map เพื่อวนลูปข้อมูล details
  // เช็คว่า id ตรงกับรายการที่ต้องการแก้ไขหรือไม่
  // ถ้าใช่: สร้าง object ใหม่ โดยเปลี่ยนค่าของ text เป็น value.
  // ถ้าไม่ใช่: คืนค่ารายการเดิม.

  // อัปเดต Detail
  const updateDetail = (id, value) => {
    setDetails(
      details.map((detail) =>
        detail.id === id ? { ...detail, text: value } : detail,
      ),
    );
  };

  // ลบ Detail
  const handleDelete = (id) => {
    setDetails(details.filter((detail) => detail.id !== id));
  };

  // Verify authentication
  useEffect(() => {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      router.push("/admin/login");
    } else {
      try {
        const decodedToken = jwtDecode(token);
        const now = Date.now() / 1000;
        if (decodedToken.exp < now) {
          logout(); // Token expired, redirect to login
        } else {
          setAuthLoading(false);
        }
      } catch (error) {
        console.error("Token decoding error:", error);
        logout(); // Invalid token, redirect to login
      }
    }
  }, [router]);

  if (authLoading) {
    return <div></div>; // แสดง Loading Spinner หรือข้อความขณะกำลังตรวจสอบ
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSideBar />
      {/* Main Content */}
      <main className="flex-1">
        <AdminHeader
          title="Add Package"
          buttons={[
            {
              label: "Cancel",
              type: "secondary",
              onClick: () => router.push("/admin/merry-package-list"),
            },
            {
              label: isSaving ? "Creating..." : "Create",
              type: "primary",
              onClick: handleAddPackage,
              disabled: isSaving, // กำหนด disabled
            },
          ]}
        />
        <div className="mx-auto p-8">
          <div className="mx-auto max-w-5xl rounded-lg bg-white p-8 shadow">
            <div className="mb-8 grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="packageName"
                  className="block font-medium text-gray-700"
                >
                  Package name <span className="text-red-500">*</span>
                </label>
                <input
                  id="packageName"
                  type="text"
                  value={packageName}
                  onChange={(e) => setPackageName(e.target.value)}
                  className="mt-1 h-12 w-full rounded-md border-2 border-gray-300 px-4 shadow-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="merryLimit"
                  className="block font-medium text-gray-700"
                >
                  Merry limit <span className="text-red-500">*</span>
                </label>
                <select
                  id="merryLimit"
                  value={merryLimit}
                  onChange={(e) => setMerryLimit(e.target.value)}
                  className="mt-1 h-12 w-full rounded-md border-2 border-gray-300 px-4 shadow-sm"
                >
                  <option value=""></option>
                  <option value="25">25</option>
                  <option value="45">45</option>
                  <option value="70">70</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="packageName"
                  className="block font-medium text-gray-700"
                >
                  Price <span className="text-red-500">*</span>
                </label>
                <input
                  id="price"
                  type="text"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="mt-1 h-12 w-full rounded-md border-2 border-gray-300 px-4 shadow-sm"
                />
              </div>
              <div>
                <input className="mt-1 hidden h-12 w-full rounded-md border-2 border-gray-300 px-4 shadow-sm" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="block font-medium text-gray-700">
                Icon <span className="text-red-500">*</span>
              </label>
              <div className="relative flex h-32 w-32 items-center justify-center overflow-hidden rounded-3xl border border-gray-300 bg-gray-100">
                {!icon ? (
                  <>
                    <input
                      id="upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    <label
                      htmlFor="upload"
                      className="flex cursor-pointer flex-col items-center justify-center text-primary-500"
                    >
                      <span className="text-3xl font-bold">+</span>
                      <p className="text-sm font-medium">Upload icon</p>
                    </label>
                  </>
                ) : (
                  <div className="relative h-full w-full">
                    <img
                      src={URL.createObjectURL(icon)}
                      alt="Uploaded Icon"
                      className="h-full w-full rounded-lg object-fill" //object-contain
                    />
                    <button
                      type="button"
                      onClick={handleRemoveIcon}
                      className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs text-white hover:bg-red-600"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
            </div>

            <hr className="my-8 border-gray-300" />
            {/* Package Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700">
                Package Detail
              </h3>

              {/* addDetail Step3:
               1. ใช้ .map เพื่อวนลูป State: details
               2. key={detail.id}  ใช้ id เป็น key เพื่อช่วย React แยกแยะ element แต่ละตัว 
               3. แสดงค่าจาก detail.text ใน <input>
              */}
              {details.map((detail) => (
                <div
                  key={detail.id}
                  className="mt-4 flex items-center space-x-4"
                >
                  <span className="cursor-move text-gray-400">⋮⋮</span>
                  <label className="w-full">
                    <input
                      type="text"
                      placeholder="Enter detail"
                      value={detail.text}
                      //updateDetail Step1: เก็บค่า key={detail.id} และ e.target.value
                      onChange={(e) => updateDetail(detail.id, e.target.value)}
                      id={`detail-${detail.id}`}
                      name={`detail-${detail.id}`}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    />
                  </label>
                  {/* deleteDetail Step1: เรียกใช้ function confirmDelete และส่งค่า detail.id ของแถวนั้นๆ */}
                  <button
                    onClick={() => handleDelete(detail.id)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    Delete
                  </button>
                </div>
              ))}
              {/* Add Detail Button */}
              <div className="mt-6">
                <button
                  // addDetail Step1:  onClick to Function > addDetail
                  onClick={addDetail}
                  className="rounded-lg bg-pink-100 px-4 py-2 text-pink-500 hover:bg-pink-200"
                >
                  + Add detail
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/*  Modal */}
      <DeleteConfirmationModal
        isOpen={isModalOpen} // isModalOpen = true เปิดใช้งาน
        onClose={closeModal} // deleteDetail Step3.2: เรียกใช้ function closeModal เพื่อยกเลิก
        onConfirm={() => {
          setIsModalOpen(false);
          router.push("/admin/merry-package-list");
        }}
        title="Success"
        message="Package added successfully!"
        confirmLabel="Submit"
      />

      {/*  Modal Validation */}
      <DeleteConfirmationModal
        isOpen={isModalValidation} // isModalOpen = true เปิดใช้งาน
        onClose={() => setIsModalValidation(false)}
        onConfirm={() => {
          setIsModalValidation(false);
        }}
        title="Validation Error"
        message={modalMessage}
        confirmLabel="Submit"
      />
    </div>
  );
}

export default MerryPackageAdd;
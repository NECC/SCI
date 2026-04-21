"use client";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  Card,
  CardBody,
  CardHeader,
  Divider,
} from "@nextui-org/react";
import { useForm } from "react-hook-form";

export default function AddSpeaker() {
    const router = useRouter();
    const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    } = useForm<{ name: string; image: FileList | null }>({
    defaultValues: {
        name: "",
        image: null,
    },
    });

const imageFile = watch('image');
const selectedFile: File | null = imageFile && imageFile.length > 0 ? imageFile[0] : null;
const imagePreview = selectedFile ? URL.createObjectURL(selectedFile) : null;

  const onSubmit = (formData: any) => {
    const data = new FormData();
    data.append("name", formData.name);
    if (formData.image && formData.image[0]) {
      data.append("file", formData.image[0]);
    }

    axios
      .post("/api/speakers", data)
      .then((res) => {
        if (res.status === 200) {
          router.push("/admin");
          router.refresh();
        }
      })
      .catch((err) => {
        console.error(err);
        alert("Erro ao criar Speaker");
      });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col items-center justify-center gap-1 mt-1"
      noValidate
    >
      <Card className="w-[250px] pb-4">
        <CardHeader className="flex justify-center bg-black text-white rounded-t-xl">
          Add New Speaker
        </CardHeader>
        <Divider />
        <CardBody className="flex flex-col items-center justify-center gap-3">
          {/* Name Input */}
          <div className="flex flex-col w-[220px]">
            <input
              type="text"
              placeholder="Name"
              className={`w-full px-3 py-2 rounded-xl border text-sm outline-none transition-colors
                ${errors.name ? "border-red-500" : "border-gray-300 focus:border-black"}`}
              {...register('name', { required: "Name is required" })}
            />
            {errors.name && (
              <span className="text-red-500 text-xs mt-1">{errors.name.message as string}</span>
            )}
          </div>

          {/* Image Input + Preview */}
          <div className="flex flex-col w-[220px] gap-2">
            <label className="text-sm font-medium text-gray-700">Image</label>
            <label className={`flex items-center justify-center w-full h-9 rounded-xl border cursor-pointer text-sm transition-colors
              ${errors.image ? "border-red-500" : "border-gray-300 hover:border-black"}`}>
              <span className="text-gray-500 text-xs">
                {selectedFile ? selectedFile.name : "Choose an image..."}
              </span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                {...register('image', { required: "Image is required" })}
              />
            </label>
            {errors.image && (
              <span className="text-red-500 text-xs">{errors.image.message as string}</span>
            )}

            {/* Preview */}
            {imagePreview && (
              <div className="w-full rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-36 object-cover"
                />
              </div>
            )}
          </div>
        </CardBody>

        <div className="px-4 w-full flex justify-center mt-2">
          <button
            type="submit"
            className="w-[220px] py-2.5 rounded-xl bg-black hover:bg-slate-800 text-white transition-colors shadow-md text-sm font-medium"
          >
            Add Speaker
          </button>
        </div>
      </Card>
    </form>
  );
}
import Image from "next/image";
import FileUpload from "./components/file-upload";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center p-24">
      <div className="flex flex-col md:flex-row w-full max-w-5xl">
        <div className="flex w-[30vw] items-center justify-center bg-gray-100 p-4">
          <FileUpload />
        </div>
        <div className="flex w-[70vw] items-center justify-center bg-gray-200 p-4">
          <h1 className="text-2xl text-black font-bold">
            Welcome to the right side!
          </h1>
        </div>
      </div>
    </div>
  );
}

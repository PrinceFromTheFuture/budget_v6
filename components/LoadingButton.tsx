"use client";
import React from "react";
import { LoaderCircle } from "lucide-react";
import { Button } from "./ui/button";

const LoadingButton = ({ isLoading, type }: { isLoading: boolean; type?: "submit" | "button" }) => {
  return (
    <Button disabled={isLoading} className=" w-full bg-primary" type={type}>
      {isLoading ? (
        <div className=" flex justify-between gap-2 items-center">
          <LoaderCircle className=" animate-spin" /> <div className=" text-white/50">loading...</div>
        </div>
      ) : (
        "Submit"
      )}
    </Button>
  );
};

export default LoadingButton;

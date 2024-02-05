"use client";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Button } from "@nextui-org/react";
import { CiLight } from "react-icons/ci";
import { CiDark } from "react-icons/ci";

const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
  };

  return (
      <Button className={`${theme === "light" ? "custom-background custom-box border-white " : "bg-white border-black "} border-2 fixed right-4 bottom-16 z-10 h-[80px] w-[70px] rounded-full transition-colors duration-500 ease-in-out hidden lg:flex`} onClick={toggleTheme}>
        {theme === "light" ? (
          <CiLight size={55} color="white"/>
        ) : (
          <CiDark size={55} color="black" />
        )}
      </Button>
  );
};

export default ThemeSwitcher;


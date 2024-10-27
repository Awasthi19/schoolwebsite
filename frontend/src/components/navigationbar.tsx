"use client";

import { useState, useEffect, useRef } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  HoveredLink,
  Menu,
  MenuItem,
  ProductItem,
} from "@/components/ui/navbar-menu";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { FaSun, FaMoon, FaGlobe } from "react-icons/fa";
import "../styles/navbar.css"

function Navigationbar({ className }: { className?: string }) {
  const { systemTheme, theme, setTheme } = useTheme();
  const [isDark, setIsDark] = useState<boolean>(false);
  const currentTheme = theme === "system" ? systemTheme : theme;

  const [activeLink, setActiveLink] = useState("home");

  const [mounted, setMounted] = useState(false);

  // Toggle the theme
  const toggleTheme = () => {
    setIsDark(!isDark);
    if (isDark) {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };

  const onUpdateActiveLink = (value: string) => {
    setActiveLink(value);
  };

  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className={cn("fixed  inset-x-0 mx-auto z-50 ", className)}>
      <Navbar
        expand="md"
        className="bg-custom-light text-custom-light shadow-custom-light dark:bg-custom-dark dark:text-custom-dark dark:shadow-custom-dark "
      >
        <>
          <Navbar.Brand href="/">
            <Image src="/sycas-logo.svg" width={500} height={500} alt="logo" priority />
          </Navbar.Brand>

          <Nav className="ms-auto">
          <Nav.Link
              href="#projects"
              className={
                activeLink === "projects" ? "active navbar-link" : "navbar-link"
              }
              onClick={() => onUpdateActiveLink("projects")}
            >
              <Menu setActive={setActive}>
                Admin Roles
              </Menu>
            </Nav.Link>
            <Nav.Link
              href="#projects"
              className={
                activeLink === "projects" ? "active navbar-link" : "navbar-link"
              }
              onClick={() => onUpdateActiveLink("projects")}
            >
              <Menu setActive={setActive}>
                <MenuItem setActive={setActive} active={active} item="Setup">
                  <div className="flex flex-col space-y-4 text-sm ">
                    <HoveredLink href="/set-fees">Set Fees</HoveredLink>
                    <HoveredLink href="/news">News and Notices</HoveredLink>
                    <HoveredLink href="/teachers">School Members</HoveredLink>
                    
                  </div>
                </MenuItem>
              </Menu>
            </Nav.Link>

            <Nav.Link
              className={
                activeLink === "skills" ? "active navbar-link" : "navbar-link"
              }
              onClick={() => onUpdateActiveLink("skills")}
            >
              <Menu setActive={setActive}>
                <MenuItem setActive={setActive} active={active} item="Reports">
                  <div className="flex flex-col space-y-4 text-sm">
                    <HoveredLink href="/billing-report">
                      Billing Report
                    </HoveredLink>
                    <HoveredLink href="/due-report">Due Report</HoveredLink>
                    <HoveredLink href="/customer-report">
                      Student Report
                    </HoveredLink>
                  </div>
                </MenuItem>
              </Menu>
              
            </Nav.Link>

            <Nav.Link
              href="#skills"
              className={
                activeLink === "skills" ? "active navbar-link" : "navbar-link"
              }
              onClick={() => onUpdateActiveLink("skills")}
            >
              <Menu setActive={setActive}>
                <MenuItem setActive={setActive} active={active} item="Billing">
                  <div className="flex flex-col space-y-4 text-sm">
                    <HoveredLink href="/masik-billing">
                      Payment 
                    </HoveredLink>
                    <HoveredLink href="/account">
                      Account
                    </HoveredLink>
                    <HoveredLink href="/statement">Statement</HoveredLink>
                    
                  </div>
                </MenuItem>
              </Menu>
              
            </Nav.Link>
            <Nav.Link
              href="#home"
              className={
                activeLink === "home" ? "active navbar-link" : "navbar-link"
              }
              onClick={() => onUpdateActiveLink("home")}
            >
              <Menu setActive={setActive}>
                <MenuItem setActive={setActive} active={active} item="student">
                  <div className="  text-sm grid grid-cols-2 gap-10 p-4">
                    <ProductItem
                      title="Register Student"
                      href="/register-customer"
                      src="/sycas-halflogo.svg"
                      description="Quickly add new students"
                    />
                    <ProductItem
                      title="Edit Student"
                      href="/edit-customer"
                      src="/sycas-halflogo.svg"
                      description="Easily update student details"
                    />
                    <ProductItem
                      title="Cancel Transaction"
                      href="/cancel-transaction"
                      src="/sycas-halflogo.svg"
                      description="Seamlessly cancel ongoing transactions"
                    />
                    <ProductItem
                      title="Delete Student"
                      href="/delete-customer"
                      src="/sycas-halflogo.svg"
                      description="Permanently remove students "
                    />
                  </div>
                </MenuItem>
              </Menu>
            </Nav.Link>
          </Nav>

          <Navbar.Toggle aria-controls="basic-navbar-nav">
            <span className="navbar-toggler-icon"></span>
          </Navbar.Toggle>

          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto space-x-4">
              <Menu setActive={setActive}>
                <div
                  style={{
                    border: isDark
                      ? "1px solid rgb(100,100,100)"
                      : "1px solid rgb(5,5,5)",
                  }}
                  className="flex items-center px-2 py-1 rounded-md "
                >
                  <FaGlobe className="mr-2 text-gray-600 text-lg" />
                  <MenuItem
                    setActive={setActive}
                    active={active}
                    item="Language"
                  >
                    <div className="flex flex-col space-y-4 text-sm">
                      <HoveredLink href="/english">English</HoveredLink>
                      <HoveredLink href="/nepali">Nepali</HoveredLink>
                    </div>
                  </MenuItem>
                </div>
              </Menu>

              {/* Toggle Theme Button */}
              <div className="flex items-center space-x-2">
                {isDark ? (
                  <FaSun
                    onClick={toggleTheme}
                    className="text-yellow-200 cursor-pointer text-2xl"
                  />
                ) : (
                  <FaMoon
                    onClick={toggleTheme}
                    className="text-gray-500 cursor-pointer text-2xl"
                  />
                )}
              </div>

              <Link href="/profile">
                <Image
                  src="/sycas-halflogo.svg" 
                  alt="Profile"
                  width={30} 
                  height={30} 
                  className="rounded-full object-cover"
                />
              </Link>
            </Nav>
          </Navbar.Collapse>
        </>
      </Navbar>
    </div>
  );
}

export default Navigationbar;

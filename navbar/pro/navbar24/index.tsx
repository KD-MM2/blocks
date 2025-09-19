"use client";

import {
  Bell,
  Heart,
  Home,
  LogOut,
  PanelBottomOpen,
  Settings,
  ShoppingCart,
  User,
} from "lucide-react";
import {
  AnimatePresence,
  motion,
  MotionValue,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import { useRef, useState } from "react";
import * as React from "react";

import { cn } from "@/lib/utils";

const Navbar24 = () => {
  const tabs = [
    {
      title: "Home",
      icon: <Home />,
      href: "#home",
    },
    {
      title: "Notifications",
      icon: <Bell />,
      href: "#notifications",
    },
    {
      title: "Profile",
      icon: <User />,
      href: "#profile",
    },
    {
      title: "Settings",
      icon: <Settings />,
      href: "#settings",
    },
    {
      title: "Favorites",
      icon: <Heart />,
      href: "#favorites",
    },
    {
      title: "Cart",
      icon: <ShoppingCart />,
      href: "#cart",
    },
    {
      title: "Logout",
      icon: <LogOut />,
      href: "#logout",
    },
  ];
  return (
    <section className="py-32">
      <div className="container flex justify-center">
        <FloatingDock
          desktopClassName="
        fixed bottom-4 left-1/2 -translate-x-1/2  "
          mobileClassName="fixed right-6 bottom-6"
          items={tabs}
        />
      </div>
    </section>
  );
};
export { Navbar24 };

// Below is the modified component from Aceternity UI
// Original source: npx shadcn@latest add https://ui.aceternity.com/registry/floating-dock.json
// Modified to follow our coding standards and design system
// We respect copyright and attribution to the original creators

const FloatingDock = ({
  items,
  desktopClassName,
  mobileClassName,
}: {
  items: { title: string; icon: React.ReactNode; href: string }[];
  desktopClassName?: string;
  mobileClassName?: string;
}) => {
  return (
    <>
      <FloatingDockDesktop items={items} className={desktopClassName} />
      <FloatingDockMobile items={items} className={mobileClassName} />
    </>
  );
};

const FloatingDockMobile = ({
  items,
  className,
}: {
  items: { title: string; icon: React.ReactNode; href: string }[];
  className?: string;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={cn("block md:hidden", className)}>
      <AnimatePresence>
        {open && (
          <motion.div
            layoutId="nav"
            className="z-99 absolute inset-x-0 bottom-full mb-2 flex flex-col gap-2"
          >
            {items.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: 10,
                  transition: {
                    delay: idx * 0.05,
                  },
                }}
                transition={{ delay: (items.length - 1 - idx) * 0.05 }}
              >
                <a
                  href={item.href}
                  key={item.title}
                  className="bg-foreground text-muted-foreground flex h-10 w-10 items-center justify-center rounded-xl"
                >
                  <div>{item.icon}</div>
                </a>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <button
        onClick={() => setOpen(!open)}
        className="bg-foreground text-muted-foreground flex h-10 w-10 items-center justify-center rounded-xl"
      >
        <PanelBottomOpen />
      </button>
    </div>
  );
};

const FloatingDockDesktop = ({
  items,
  className,
}: {
  items: { title: string; icon: React.ReactNode; href: string }[];
  className?: string;
}) => {
  const mouseX = useMotionValue(Infinity);
  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn(
        "bg-foreground z-99 mx-auto hidden h-16 items-end items-center justify-center gap-2 rounded-3xl px-5 md:flex",
        className,
      )}
    >
      {items.map((item) => (
        <IconContainer mouseX={mouseX} key={item.title} {...item} />
      ))}
    </motion.div>
  );
};

function IconContainer({
  mouseX,
  title,
  icon,
  href,
}: {
  mouseX: MotionValue;
  title: string;
  icon: React.ReactNode;
  href: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };

    return val - bounds.x - bounds.width / 2;
  });

  const widthTransform = useTransform(distance, [-150, 0, 150], [40, 60, 40]);
  const heightTransform = useTransform(distance, [-150, 0, 150], [40, 60, 40]);

  const widthTransformIcon = useTransform(
    distance,
    [-150, 0, 150],
    [20, 40, 20],
  );
  const heightTransformIcon = useTransform(
    distance,
    [-150, 0, 150],
    [20, 40, 20],
  );

  const width = useSpring(widthTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  const height = useSpring(heightTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  const widthIcon = useSpring(widthTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  const heightIcon = useSpring(heightTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  const rounded = useSpring(
    useTransform(distance, [-150, 0, 150], [50, 10, 50]),
    {
      mass: 0.1,
      stiffness: 150,
      damping: 12,
    },
  );

  const [hovered, setHovered] = useState(false);

  return (
    <a href={href}>
      <motion.div
        ref={ref}
        style={{ width, height, borderRadius: rounded }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="bg-background/10 relative flex aspect-square items-center justify-center"
      >
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 10, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: 2, x: "-50%" }}
              className="bg-muted absolute -top-8 left-1/2 w-fit whitespace-pre rounded-full px-4 py-0.5 text-xs"
            >
              {title}
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          style={{ width: widthIcon, height: heightIcon }}
          className="text-muted-foreground flex items-center justify-center"
        >
          {icon}
        </motion.div>
      </motion.div>
    </a>
  );
}

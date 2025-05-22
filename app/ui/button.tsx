import clsx from "clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function Button({ children, className, ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      className={clsx(
        "neon-button material-button w-full text-lg font-bold mt-16",
        className
      )}
    >
      {children}
    </button>
  );
}

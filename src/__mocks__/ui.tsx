export const Button = ({ children, ...props }: any) => (
  <button {...props}>{children}</button>
);

export const Input = (props: any) => <input {...props} />;

export const Select = (props: any) => <select {...props} />;
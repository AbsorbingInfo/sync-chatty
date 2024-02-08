type ButtonProps = {
  text: string;
};

const Button = ({ text }: ButtonProps) => {
  return (
    <button type="submit" className="btn">
      {text}
    </button>
  );
};

export default Button;

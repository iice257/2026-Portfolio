import styles from "./Button.module.scss";

const Button = ({ href, onClick, children, classes = "", type, disable = false, tabIndex, ...otherProps }) => {
  const handleClick = (event) => {
    if (disable) {
      event.preventDefault();
      return;
    }

    onClick?.(event);
  };

  return (
    <a
      href={disable ? undefined : href}
      onClick={handleClick}
      aria-disabled={disable || undefined}
      tabIndex={disable ? -1 : tabIndex}
      className={`
        ${
          type === "primary"
            ? !disable
              ? styles.primary__button
              : styles.primary__disabledButton
            : !disable
            ? styles.secondary__button
            : styles.secondary__disabledButton
        }
          ${classes}
      `}
      {...otherProps}
    >
      {children}
    </a>
  );
};

export default Button;

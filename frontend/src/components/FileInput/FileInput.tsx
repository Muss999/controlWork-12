import { type ChangeEvent, type FC } from "react";

interface Props {
  onFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  name: string;
  placeholder: string;
  fileName: string;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

const FileInput: FC<Props> = ({
  onFileChange,
  name,
  placeholder,
  fileName,
  inputRef,
}) => {
  const activateInput = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <>
      <input
        type="file"
        style={{ display: "none" }}
        name={name}
        ref={inputRef}
        onChange={onFileChange}
      />
      <div className="d-flex align-items-center gap-3">
        <input
          className="w-100"
          readOnly
          placeholder={placeholder}
          value={fileName}
          onClick={activateInput}
        />
        <button
          type="button"
          className="btn btn-primary"
          onClick={activateInput}
        >
          Browse
        </button>
      </div>
    </>
  );
};

export default FileInput;

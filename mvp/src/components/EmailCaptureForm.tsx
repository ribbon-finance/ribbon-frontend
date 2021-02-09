import { Input } from "antd";
import styled from "styled-components";
const { Search } = Input;

const EmailForm = styled(Search)`
  width: 440px;
  height: 64px;
`;

const EmailCaptureForm: React.FC<{ theme: "light" | "dark" }> = ({ theme }) => {
  return (
    <span className={`email-capture email-capture-${theme}`}>
      <EmailForm
        type="email"
        placeholder="Enter your email"
        onSearch={() => {}}
        enterButton="Submit"
      />
    </span>
  );
};
export default EmailCaptureForm;

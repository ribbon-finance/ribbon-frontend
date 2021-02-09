import { Input } from "antd";
import MailchimpSubscribe from "react-mailchimp-subscribe";
import styled from "styled-components";
const { Search } = Input;

const url =
  "https://finance.us7.list-manage.com/subscribe/post?u=d82fe4baf3a5dad6939b5a114&id=01e022ce62";

const EmailForm = styled(Search)`
  width: 440px;
  height: 64px;
`;

const EmailCaptureForm: React.FC<{ theme: "light" | "dark" }> = ({ theme }) => {
  return (
    <MailchimpSubscribe
      url={url}
      render={({ subscribe, status }) => {
        let buttonMsg;
        switch (status) {
          case "error":
            buttonMsg = "Failed to submit";
            break;
          case "sending":
            buttonMsg = "Submitting...";
            break;
          case "success":
            buttonMsg = "Submitted!";
            break;
          default:
            buttonMsg = "Submit";
            break;
        }

        return (
          <span className={`email-capture email-capture-${theme}`}>
            <EmailForm
              type="email"
              placeholder="Enter your email"
              onSearch={(email) => subscribe({ EMAIL: email })}
              enterButton={buttonMsg}
            />
          </span>
        );
      }}
    ></MailchimpSubscribe>
  );
};
export default EmailCaptureForm;

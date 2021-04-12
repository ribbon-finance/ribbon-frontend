import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import styled from "styled-components";
import { PrimaryText, SecondaryText, Title } from "../designSystem";

const PolicyTitle = styled(Title)`
  font-size: 24px;
  line-height: 32px;
  margin-top: 48px;
`;

const SectionTitle = styled(Title)`
  font-size: 18px;
  line-height: 24px;
  text-transform: uppercase;
  margin-top: 48px;
  margin-bottom: 24px;
`;

const SectionQuestion = styled(PrimaryText)`
  font-size: 16px;
  line-height: 24px;
  font-weight: 600;
  margin-bottom: 16px;
`;

const SectionAnswer = styled(SecondaryText)`
  font-size: 16px;
  line-height: 24px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.64);
  margin-bottom: 24px;
`;

const sections = [
  {
    sectionName: "Overview",
    questions: [
      {
        question: "Last Updated: Feb 26th 2021",
        answer:
          "This Privacy Statement explains how Ribbon collects, uses, and discloses information about you through its websites, including web applications, and other online products and services (collectively, the “Services”) or when you otherwise interact with us. We may change this Privacy Statement from time to time. If we make changes, we will notify you by revising the date at the top of the Privacy Statement and, in some cases, we may provide you with additional notice (such as adding a statement to our homepage or sending you a notification). We encourage you to review the Privacy Statement whenever you access the Services or otherwise interact with us to stay informed about our information practices and the choices available to you.",
      },
    ],
  },
  {
    sectionName: "Collection of Information",
    questions: [
      {
        question: "Information You Provide To Us",
        answer:
          "We collect information you provide directly to us. For example, we collect information when you participate in any interactive features of the Services, fill out a form, engage in a transaction, apply for a job, communicate with us via third party social media sites, request customer support or otherwise communicate with us. The types of information we may collect include your email address and any other information you choose to provide.",
      },
      {
        question: "Automatically Collected Information",
        answer:
          "When you access or use our Services, we automatically collect information about you. We collect log information about your use of the Services, including the type of browser you use, access times, pages viewed, your IP address and the page you visited before navigating to our Services. We collect information about the computer or mobile device you use to access our Services, including the hardware model, operating system and version, unique device identifiers, and mobile network information. Information Collected by Cookies and Other Tracking Technologies: We use various technologies to collect information, including cookies and web beacons. Cookies are small data files stored on your hard drive or in device memory that help us improve our Services and your experience, see which areas and features of our Services are popular and count visits. Web beacons are electronic images that may be used in our Services or emails and help deliver cookies, count visits and understand usage and campaign effectiveness. For more information about cookies and how to disable them, please see “Your Choices” below.",
      },
      {
        question: "Information We Collect from Other Sources",
        answer:
          "We may obtain information from other sources, including third parties, and combine that with information we collect through our Services.",
      },
    ],
  },
  {
    sectionName: "Use of Information",
    questions: [
      {
        question: "",
        answer:
          "We use the information we collect to provide, maintain, and improve our services. We may also use the information we collect to: Send you technical notices, updates, security alerts and support and administrative messages and to respond to your comments, questions and customer service requests; Communicate with you about products, services, offers, and events offered by Ribbon and others, and provide news and information we think will be of interest to you; Monitor and analyze trends, usage and activities in connection with our Services; and Detect, investigate and prevent fraudulent transactions and other illegal activities and protect the rights and property of Ribbon and others.",
      },
    ],
  },
  {
    sectionName: "Sharing of Information",
    questions: [
      {
        question: "",
        answer:
          "We may share information about you as follows or as otherwise described in this Privacy Statement: With vendors, consultants and other service providers who need access to such information to carry out work on our behalf; In response to a request for information if we believe disclosure is in accordance with, or required by, any applicable law, regulation or legal process; If we believe your actions are inconsistent with our user agreements or policies, or to protect the rights, property and safety of Ribbon or others; In connection with, or during negotiations of, any merger, sale of company assets, financing or acquisition of all or a portion of our business by another company; Between and among Ribbon and our current and future parents, affiliates, subsidiaries and other companies under common control and ownership; and With your consent or at your direction.",
      },
    ],
  },
  {
    sectionName: "Advertising and Analytics Services Provided by Others",
    questions: [
      {
        question: "",
        answer:
          "We may allow others to provide analytics services and serve advertisements on our behalf across the internet and in applications. These entities may use cookies, web beacons, device identifiers and other technologies to collect information about your use of the Services and other websites and applications, including your IP address, web browser, mobile network information, pages viewed, time spent on pages or in apps, links clicked and conversion information. This information may be used by Ribbon and others to, among other things, analyze and track data, determine the popularity of certain content, deliver advertising and content targeted to your interests on our Services and other websites and better understand your online activity. For more information about interest-based ads, or to opt out of having your web browsing information used for behavioral advertising purposes, please visit www.aboutads.info/choices (or http://www.youronlinechoices.eu/if you are a resident of the European Economia Area)",
      },
    ],
  },
  {
    sectionName: "Security",
    questions: [
      {
        question: "",
        answer:
          "Ribbon takes reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction.",
      },
    ],
  },
  {
    sectionName: "Data Retention",
    questions: [
      {
        question: "",
        answer:
          "We store the information we collect about you for as long as is necessary for the purpose(s) for which we originally collected it, or for other legitimate business purposes, including to meet our legal or other regulatory obligations.",
      },
    ],
  },
  {
    sectionName: "Residents of the European Economic Area",
    questions: [
      {
        question: "",
        answer:
          "If you are a resident of the European Economic Area (“EEA”), you have certain rights and protections under the law regarding the processing of your personal data.",
      },
      {
        question: "Legal Basis for Processing",
        answer:
          "If you are a resident of the EEA, when we process your personal data we will only do so in the following situations: We need to use your personal data to perform our responsibilities under our contract with you (e.g., providing the Ribbon services you have requested). We have a legitimate interest in processing your personal data. For example, we may process your personal data to send you marketing communications, to communicate with you about changes to our Services, and to provide, secure, and improve our Services. You have consented to the processing of your personal data for one or more specific purposes.",
      },
      {
        question: "Data Subject Requests",
        answer:
          "If you are a resident of the EEA, you have the right to access personal data we hold about you and to ask that your personal data be corrected, erased, or transferred. You may also have the right to object to, or request that we restrict, certain processing. If you would like to exercise any of these rights, you can contact us as indicated below.",
      },
      {
        question: "Questions or Complaints",
        answer:
          "If you are a resident of the EEA and have a concern about our processing of personal data that we are not able to resolve, you have the right to lodge a complaint with the data privacy authority where you reside. For contact details of your local Data Protection Authority, please see: http://ec.europa.eu/justice/data-protection/article-29/structure/data-protection-authorities/index_en.htm.",
      },
    ],
  },
  {
    sectionName: "Your Choices",
    questions: [
      {
        question: "Account Information",
        answer:
          "You may update, correct or delete information about you at any time by emailing us at julian@ribbon.finance. Please note that we may retain cached or archived copies of information about you for a certain period of time.",
      },
      {
        question: "Cookies",
        answer:
          "Most web browsers are set to accept cookies by default. If you prefer, you can usually choose to set your browser to remove or reject browser cookies. Please note that if you choose to remove or reject cookies, this could affect the availability and functionality of our Services.",
      },
      {
        question: "Promotional Communications",
        answer:
          "You may opt out of receiving promotional communications from Ribbon by following the instructions in those communications or by emailing us at julian@ribbon.finance. If you opt out, we may still send you non-promotional emails, such as those about your account or our ongoing business relations.",
      },
      {
        question: "Mobile Push Notifications/Alerts",
        answer:
          "With your consent, we may send promotional and non-promotional push notifications or alerts to your mobile device. You can deactivate these messages at any time by changing the notification settings on your mobile device.",
      },
    ],
  },
  {
    sectionName: "Contact Us",
    questions: [
      {
        question: "",
        answer:
          "You may update, correct or delete information about you at any time by emailing us at julian@ribbon.finance. Please note that we may retain cached or archived copies of information about you for a certain period of time.",
      },
    ],
  },
];

const PolicyPage = () => {
  return (
    <Container>
      <Row className="justify-content-center">
        <Col
          xs={11}
          sm={10}
          md={9}
          lg={8}
          xl={7}
          className="d-flex flex-column"
        >
          <PolicyTitle>Privacy Policy</PolicyTitle>
          {sections.map((section) => (
            <>
              <SectionTitle>{section.sectionName}</SectionTitle>
              {section.questions.map((question) => (
                <>
                  <SectionQuestion>{question.question}</SectionQuestion>
                  <SectionAnswer>{question.answer}</SectionAnswer>
                </>
              ))}
            </>
          ))}
        </Col>
      </Row>
    </Container>
  );
};

export default PolicyPage;

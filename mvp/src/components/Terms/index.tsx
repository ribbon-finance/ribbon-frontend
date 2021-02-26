import React from "react";
import styled from "styled-components";
import { PrimaryMedium } from "../../designSystem";

const H1 = styled(PrimaryMedium)`
  font-size: 50px;
`;

const H2 = styled(PrimaryMedium)`
  font-size: 30px;
`;

const QuestionText = styled.p`
  margin-bottom: 0.5em;
  font-weight: 500;
`;

const AnswerText = styled.p`
  margin-bottom: 2em;
`;

const Anchor = styled.a`
  color: blue;
`;

const sections = [
  {
    sectionName: "Overview",
    questions: [
      {
        question: "",
        answer: (
          <span>
            <p>
              These terms of service, together with any documents and additional
              terms they expressly incorporate by reference (collectively, these
              “Terms”), are entered into between Ribbon Inc. (“Ribbon,” “we,”
              “us” and “our”) and you or the company or other legal entity you
              represent (“you” or “your”), and constitute a binding legal
              agreement. Please read these Terms carefully, as these Terms
              govern your use of our Portal and our Services, and expressly
              cover your rights and obligations, and our disclaimers and
              limitations of legal liability, relating to such use. By accessing
              or using our Portal or our Services, you accept and agree to be
              bound by and to comply with these Terms, including the mandatory
              arbitration provision in Section 12. If you do not agree to these
              Terms, you must not access or use our Portal or the Services.
            </p>
            <p>
              You must be able to form a legally binding contract online either
              on behalf of a company or as an individual. Accordingly, you
              represent that: (a) if you are agreeing to these Terms on behalf
              of a company or other legal entity, you have the legal authority
              to bind the company or other legal entity to these Terms; and (b)
              you are at least 18 years old (or the age of majority where you
              reside, whichever is older), can form a legally binding contract
              online, and have the full, right, power and authority to enter
              into and to comply with the obligations under these Terms.
            </p>
            <p>
              Please carefully review the disclosures and disclaimers set forth
              in Section 9 in their entirety before using any software developed
              by Ribbon. The information in Section 9 provides important details
              about the legal obligations associated with your use of the Ribbon
              open-source software. By accessing or using our Portal or our
              Services, you agree that Ribbon does not provide execution or
              clearing services of any kind and is not responsible for the
              execution or clearing of transactions automated through Ribbon
              open-source software.
            </p>
          </span>
        ),
      },
      {
        question: "1. KEY DEFINITIONS",
        answer: (
          <span>
            <p>
              For the purpose of these Terms, the following capitalized terms
              shall have the following meanings:
            </p>
            <p>
              1.1 “Affiliate” means, with respect to a party to these Terms, any
              legal entity that, directly or indirectly controls, is controlled
              by, or is under common control with such party.“Applicable Law”
              means any domestic or foreign law, rule, statute, regulation,
              by-law, order, protocol, code, decree, or other directive,
              requirement or guideline, published or in force which applies to
              or is otherwise intended to govern or regulate any person,
              property, transaction, activity, event or other matter, including
              any rule, order, judgment, directive or other requirement or
              guideline issued by any Governmental Authority having jurisdiction
              over Ribbon, you, the Portal or the Services, or as otherwise duly
              enacted, enforceable by law, the common law or equity.
            </p>
            <p>
              1.2 “Ether” means the Ethereum Blockchain utility token that may
              be used to purchase computational resources to run decentralized
              applications or perform actions on the Ethereum Blockchain.
            </p>
            <p>
              1.3 “Ethereum Address” means the unique public key cryptocurrency
              identifier that points to an Ethereum-compatible wallet to which
              Ether may be sent or stored.1.5 “Ethereum Blockchain” means the
              underlying blockchain infrastructure which the Portal leverages to
              perform portions of the Services.
            </p>
            <p>
              1.4 “Governmental Authority” includes any domestic or foreign
              federal, provincial or state, municipal, local or other
              governmental, regulatory, judicial or administrative authority.
            </p>
            <p>
              1.5 “Portal” means the Ribbon site located at ribbon.finance, and
              all associated sites linked thereto by Ribbon and its Affiliates,
              which includes, for certainty, Ribbon’s decentralized application
              layer on the Ethereum Blockchain.
            </p>
            <p>1.6 “Services” has the meaning set out in Section 3.1.</p>
          </span>
        ),
      },
      {
        question: "2. MODIFICATIONS TO THESE TERMS",
        answer: (
          <span>
            <p>
              We reserve the right, in our sole discretion, to modify these
              Terms from time to time. If we make changes, we will provide you
              with notice of such changes, such as by sending an email,
              providing a notice through our Services or updating the date at
              the top of these Terms. Unless we say otherwise in our notice, any
              and all such modifications are effective immediately, and your
              continued use of our Services after we provide such notice will
              confirm your acceptance of the changes. If you do not agree to the
              amended Terms, you must stop using our Services.
            </p>
          </span>
        ),
      },
      {
        question: "3. SERVICES",
        answer: (
          <span>
            <p>
              3.1 Services - The primary purpose of the Portal is to enable
              users to interact with smart contracts and hedge against risk or
              gain exposure to risk via the option positions (the “Services”).
            </p>
            <p>
              3.2 Ethereum Gas Charges - Some Services involve the use of the
              Ethereum Blockchain, which may require that you pay a fee,
              commonly known as “Ethereum Gas Charges,” for the computational
              resources required to perform a transaction on the Ethereum
              Blockchain. You acknowledge and agree that Ribbon has no control
              over: (a) any Ethereum Blockchain transactions; (b) the method of
              payment of any Ethereum Gas Charges; or (c) any actual payments of
              Ethereum Gas Charges. Accordingly, you must ensure that you have a
              sufficient balance of Ether stored at your Ethereum Address to
              complete any transaction on the Ethereum Blockchain before
              initiating such Ethereum Blockchain transaction. We will make
              reasonable efforts to notify you of any Ethereum Gas Charges
              before initiating any Services that require the use of the
              Ethereum Blockchain.
            </p>
            <p>
              3.3 Conditions and Restrictions - We may, at any time and in our
              sole discretion, restrict your access to, or otherwise impose
              conditions or restrictions upon your use of, the Services or the
              Portal, with or without prior notice.
            </p>
            <p>
              3.4 No Broker, Legal or Fiduciary Relationship - Ribbon is not
              your broker, lawyer, intermediary, agent, or advisor and has no
              fiduciary relationship or obligation to you regarding any other
              decisions or activities that you effect when using the Portal or
              the Services. Neither our communications nor any information that
              we provide to you is intended as, or shall be considered or
              construed as, advice.
            </p>
            <p>
              3.5 Your Responsibilities - As a condition to accessing or using
              the Services or the Portal, you shall: (a) only use the Services
              and the Portal for lawful purposes and in accordance with these
              Terms; (b) ensure that, at all times, all information that you
              provide on the Portal is current, complete and accurate; and (c)
              maintain the security and confidentiality of your Ethereum
              Address.
            </p>
            <p>
              3.6 Unacceptable Use or Conduct - As a condition to accessing or
              using the Portal or the Services, you will not: (a) violate any
              Applicable Law, including, without limitation, any relevant and
              applicable anti-money laundering and anti-terrorist financing
              laws, such as the Bank Secrecy Act, each as may be amended; (b)
              infringe on or misappropriate any contract, intellectual property
              or other third-party right, or commit a tort while using the
              Portal or the Services; (c) use the Services in any manner that
              could interfere with, disrupt, negatively affect, or inhibit other
              users from fully enjoying the Services, or that could damage,
              disable, overburden, or impair the functioning of the Services in
              any manner; (d) attempt to circumvent any content filtering
              techniques or security measures that Ribbon employs on the Portal,
              or attempt to access any service or area of the Portal or the
              Services that you are not authorized to access; (e) use the
              Services to pay for, support, or otherwise engage in any illegal
              gambling activities, fraud, money-laundering, or terrorist
              activities, or other illegal activities; (f) use any robot,
              spider, crawler, scraper, or other automated means or interface
              not provided by us, to access the Services or to extract data; (g)
              introduce any malware, virus, Trojan horse, worm, logic bomb,
              drop-dead device, backdoor, shutdown mechanism or other harmful
              material into the Portal or the Services; (h) provide false,
              inaccurate, or misleading information; (i) post content or
              communications on the Portal that are, in our sole discretion,
              libelous, defamatory, profane, obscene, pornographic, sexually
              explicit, indecent, lewd, vulgar, suggestive, harassing, hateful,
              threatening, offensive, discriminatory, bigoted, abusive,
              inflammatory, fraudulent, deceptive or otherwise objectionable;
              (j) post content on the Portal containing unsolicited promotions,
              political campaigning, or commercial messages or any chain
              messages or user content designed to deceive or trick the user of
              the Service; (k) use the Portal or the Services from a
              jurisdiction that we have, in our sole discretion, or a relevant
              Governmental Authority has determined is a jurisdiction where the
              use of the Portal or the Services is prohibited; or (l) encourage
              or induce any third party to engage in any of the activities
              prohibited under this Section 3.7.
            </p>
            <p>
              3.7 Your Assumption of Risks - You represent and warrant that you:
              (a) have the necessary technical expertise and ability to review
              and evaluate the security, integrity and operation of any option
              position; (b) have the knowledge, experience, understanding,
              professional advice and information to make your own evaluation of
              the merits, risks and applicable compliance requirements under
              Applicable Law of any option position; (c) know, understand and
              accept the risks associated with your Ethereum Address, the
              Ethereum Blockchain, Ether and option Positions; and (d) accept
              the risks associated with option Positions, and are responsible
              for conducting your own independent analysis of the risks specific
              to any option Positions. You hereby assume, and agree that Ribbon
              will have no responsibility or liability for, such risks. You
              hereby irrevocably waive, release and discharge all claims,
              whether known or unknown to you, against Ribbon, its affiliates
              and their respective shareholders, members, directors, officers,
              employees, agents and representatives related to any of the risks
              set forth herein.
            </p>
            <p>
              3.8 - Your Content - You hereby grant to us a royalty-free, fully
              paid-up, sublicensable, transferable, perpetual, irrevocable,
              non-exclusive, worldwide license to use, copy, modify, create
              derivative works of, display, perform, publish and distribute, in
              any form, medium or manner, any content that is available to other
              users via the Ribbon Platform as a result of your use of the
              Portal (collectively, “Your Content”) through your use of the
              Services or the Portal, including, without limitation, for
              promoting Ribbon (or its Affiliates), the Services or the Portal.
              You represent and warrant that: (a) you own Your Content or have
              the right to grant the rights and licenses in these Terms; and (b)
              Your Content and our use of Your Content, as licensed herein, does
              not and will not violate, misappropriate or infringe on any third
              party’s rights.
            </p>
          </span>
        ),
      },
      {
        question: "4. PRIVACY",
        answer: (
          <span>
            <p>
              Please refer to our privacy policy available at
              https://ribbon.finance/privacy for information about how we
              collect, use, share and otherwise process information about you.
            </p>
          </span>
        ),
      },
      {
        question: "5. PROPRIETARY RIGHTS",
        answer: (
          <span>
            <p>
              5.1 - Ownership of Services; License to Services Excluding any
              open source software (as further described in Section 5.2) or
              third-party software that the Portal or the Services incorporates,
              as between you and Ribbon, Ribbon owns the Portal and the
              Services, including all technology, content and other materials
              used, displayed or provided on the Portal or in connection with
              the Services (including all intellectual property rights
              subsisting therein), and hereby grants you a limited, revocable,
              transferable, license to access and use those portions of the
              Portal and the Services that are proprietary to Ribbon.
            </p>
            <p>
              5.2 - Trademarks Any of Ribbon’s product or service names, logos,
              and other marks used in the Portal or as a part of the Services,
              including Ribbon's name and logo are trademarks owned by Ribbon,
              its Affiliates or its applicable licensors. You may not copy,
              imitate or use them without Ribbon’s (or the applicable
              licensor’s) prior written consent.
            </p>
          </span>
        ),
      },
      {
        question: "6. CHANGES; SUSPENSION; TERMINATION",
        answer: (
          <span>
            <p>
              6.1 - Changes to Services We may, at our sole discretion, from
              time to time and with or without prior notice to you, modify,
              suspend or disable, temporarily or permanently, the Services, in
              whole or in part, for any reason whatsoever, including, but not
              limited to, as a result of a security incident.
            </p>
            <p>
              6.2 - No Liability We will not be liable for any losses suffered
              by you resulting from any modification to any Services or from any
              suspension or termination, for any reason, of your access to all
              or any portion of the Portal or the Services.
            </p>
            <p>
              6.3 - Survival The following sections will survive any termination
              of your access to the Portal or the Services, regardless of the
              reasons for its expiration or termination, in addition to any
              other provision which by law or by its nature should survive:
              Sections 1, 4, 5, 6.3, and 7-14.
            </p>
          </span>
        ),
      },
      {
        question: "7. ELECTRONIC NOTICES",
        answer: (
          <span>
            <p>
              You consent to receive all communications, agreements, documents,
              receipts, notices, and disclosures electronically (collectively,
              our “Communications”) that we provide in connection with these
              Terms or any Services. You agree that we may provide our
              Communications to you by posting them on the Portal or by emailing
              them to you at the email address you provide in connection with
              using the Services, if any. You should maintain copies of our
              Communications by printing a paper copy or saving an electronic
              copy. You may also contact our support team to request additional
              electronic copies of our Communications by filing a support
              request at julian@ribbon.finance.
            </p>
          </span>
        ),
      },
      {
        question: "8. INDEMNIFICATION",
        answer: (
          <span>
            <p>
              You will defend, indemnify, and hold harmless us, our Affiliates,
              and our and our Affiliates’ respective shareholders, members,
              directors, officers, employees, attorneys, agents,
              representatives, suppliers and contractors (collectively,
              “Indemnified Parties”) from any claim, demand, lawsuit, action,
              proceeding, investigation, liability, damage, loss, cost or
              expense, including without limitation reasonable attorneys’ fees,
              arising out of or relating to (a) your use of, or conduct in
              connection with, the Portal; (b) Ethereum Blockchain assets
              associated with your Ethereum Address; (c) any feedback or user
              content you provide to the Portal, if any; (d) your violation of
              these Terms; or (e) your infringement or misappropriation of the
              rights of any other person or entity. If you are obligated to
              indemnify any Indemnified Party, Ribbon (or, at its discretion,
              the applicable Indemnified Party) will have the right, in its sole
              discretion, to control any action or proceeding and to determine
              whether Ribbon wishes to settle, and if so, on what terms.
            </p>
          </span>
        ),
      },
      {
        question: "9. DISCLOSURES; DISCLAIMERS",
        answer: (
          <span>
            <p>
              Ribbon is a developer of open-source software. Ribbon does not
              operate a virtual currency or derivatives exchange platform or
              offer trade execution or clearing services and therefore has no
              oversight, involvement, or control with respect to your
              transactions. All transactions between users of Ribbon open-source
              software are executed peer-to-peer directly between the users’
              digital wallets through a smart contract.
            </p>
            <p>
              As a user of Ribbon, you declare that you are not a citizen or
              resident of any jurisdiction in which either the use of any of the
              Services, exchange, purchase, receipt, or holding of any Tokens is
              prohibited, restricted, curtailed, hindered, impaired or otherwise
              adversely affected by any Applicable Laws;
            </p>
          </span>
        ),
      },
      {
        question: "10. EXCLUSION OF CONSEQUENTIAL AND RELATED DAMAGES",
        answer: (
          <span>
            <p>
              In no event shall we (together with our Affiliates, including our
              and our Affiliates’ respective shareholders, members, directors,
              officers, employees, attorneys, agents, representatives, suppliers
              or contractors) be liable for any incidental, indirect, special,
              punitive, consequential or similar damages or liabilities
              whatsoever (including, without limitation, damages for loss of
              data, information, revenue, goodwill, profits or other business or
              financial benefit) arising out of or in connection with the Portal
              and the Services (and any of their content and functionality), any
              execution or settlement of a transaction, any performance or
              non-performance of the Services, your Ether, option Positions or
              any other product, service or other item provided by or on behalf
              of us, whether under contract, tort (including negligence), civil
              liability, statute, strict liability, breach of warranties, or
              under any other theory of liability, and whether or not we have
              been advised of, knew of or should have known of the possibility
              of such damages and notwithstanding any failure of the essential
              purpose of these Terms or any limited remedy hereunder nor is
              Ribbon in any way responsible for the execution or settlement of
              transactions between users of Ribbon open-source software.
            </p>
          </span>
        ),
      },
      {
        question: "11. LIMITATION OF LIABILITY",
        answer: (
          <span>
            <p>
              In no event shall we (together with our Affiliates, including our
              and our Affiliates’ respective shareholders, members, directors,
              officers, employees, attorneys, agents, representatives, suppliers
              or contractors) be liable for any incidental, indirect, special,
              punitive, consequential or similar damages or liabilities
              whatsoever (including, without limitation, damages for loss of
              data, information, revenue, goodwill, profits or other business or
              financial benefit) arising out of or in connection with the Portal
              and the Services (and any of their content and functionality), any
              execution or settlement of a transaction, any performance or
              non-performance of the Services, your Ether, option Positions or
              any other product, service or other item provided by or on behalf
              of us, whether under contract, tort (including negligence), civil
              liability, statute, strict liability, breach of warranties, or
              under any other theory of liability, and whether or not we have
              been advised of, knew of or should have known of the possibility
              of such damages and notwithstanding any failure of the essential
              purpose of these Terms or any limited remedy hereunder nor is
              Ribbon in any way responsible for the execution or settlement of
              transactions between users of Ribbon open-source software.
            </p>
          </span>
        ),
      },
      {
        question: "12. GOVERNING LAW AND DISPUTE RESOLUTION",
        answer: (
          <span>
            <p>
              17.1 These Terms shall be governed by, and construed in accordance
              with, the laws of the Republic of Singapore
            </p>
            <p>
              Any dispute arising out of or in connection with these Terms,
              including any question regarding its existence, validity or
              termination, shall be referred to and finally be resolved by
              arbitration in Singapore in accordance with the rules of the SIAC
              for the time being in force, which rules are deemed to be
              incorporated by reference in this paragraph. The seat of the
              arbitration shall be Singapore. The tribunal shall consist of a
              sole arbitrator to be appointed by the Chairman of the Page 18
              SIAC. The language of the arbitration shall be English. This
              arbitration agreement shall be governed by the laws of the
              Republic of Singapore.
            </p>
            <p>
              Each of the Parties irrevocably submits to the non-exclusive
              jurisdiction of the courts of Singapore to support and assist the
              arbitration process pursuant to Paragraph 17.2 of these Terms,
              including if necessary the grant of interlocutory relief pending
              the outcome of that process.
            </p>
          </span>
        ),
      },
    ],
  },
];

const TermsPage = () => {
  return (
    <div>
      <div style={{ marginBottom: 30 }}>
        <H1>Terms and Conditions</H1>
      </div>

      {sections.map(({ sectionName, questions }) => {
        return (
          <>
            <div style={{ marginTop: 50, marginBottom: 20 }}>
              <H2>{sectionName}</H2>
            </div>

            {questions.map(({ question, answer }) => (
              <div>
                <QuestionText>{question}</QuestionText>
                <AnswerText>{answer}</AnswerText>
              </div>
            ))}
          </>
        );
      })}
    </div>
  );
};
export default TermsPage;

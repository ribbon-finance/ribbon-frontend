import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import styled from "styled-components";
import { SecondaryText, Title } from "../designSystem";
import usePullUp from "../hooks/usePullUp";

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

const SectionQuestion = styled.span`
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  color: white;
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

const StyledLink = styled.a`
  color: white;
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
              These Terms of Use, together with any documents and additional
              terms they, by reference, expressly incorporate (collectively,
              these "Terms"), are entered into between Ribbon Research LLC
              (hereinafter referred to as "Ribbon", "we", "our" or "us") and the
              person making use of Ribbon's services (hereinafter referred to as
              the "User", "you" or "your"). These Terms constitute a binding
              legal agreement between Ribbon and the User following such User's
              acceptance of such Terms.
            </p>
            <p>
              Within these Terms, words of any gender shall be held and
              construed to include any other gender, and words in the singular
              number shall be held and construed to include the plural unless
              the context otherwise requires.
            </p>
            <p>
              These Terms and any other terms and conditions incorporated herein
              by reference govern your access to and use of Ribbon's Portal and
              Services. You must read the Terms carefully. By accessing,
              browsing or otherwise using Ribbon's Portal or Services, or by
              acknowledging agreement to the Terms, you agree that you have
              read, understood and accepted all of the Terms and our Privacy
              Policy (the "Privacy Policy"), which is incorporated by reference
              into the Terms.
            </p>
            <p>
              By accessing or using Ribbon's Portal or Services, as further
              defined in Section 1, the User accepts and agrees to be bound by
              and comply with these Terms, including the mandatory arbitration
              provision envisaged in Section 18. If the User does not agree to
              these Terms, such User should not access or use Ribbon's Portal or
              Services.
            </p>
            <p>
              The User must be able to form a legally binding contract online on
              behalf of a company or as an individual, as outlined in Section 2.
            </p>
            <p>
              Ribbon appeals to the User to carefully review the disclosures and
              disclaimers set forth in Section 14 in their entirety before using
              any software developed by Ribbon. Section 14 provides important
              details about the legal obligations associated with the User's use
              of the Ribbon open-source software. By accessing or using Ribbon's
              Portal or Services, the User agrees that Ribbon does not provide
              execution or clearing services of any kind and is not responsible
              for executing or clearing transactions automated through the
              Ribbon open-source software.
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
              1.1. "Affiliate" means, with respect to a party to these Terms,
              any legal entity that, directly or indirectly controls, is
              controlled by or is under common control with Ribbon.
            </p>
            <p>
              1.2. "Applicable Law" means any domestic or foreign law, rule,
              statute, regulation, by-law, order, protocol, code, decree, or
              other directives, requirement or guideline, published or in force
              which applies to or is otherwise intended to govern or regulate
              any person, property, transaction, activity, event or other
              matter, including any rule, order, judgment, directive or other
              requirement or guideline issued by any Governmental Authority
              having jurisdiction over Ribbon, the User, the Portal or the
              Services, or as otherwise duly enacted, enforceable by law, the
              common law or equity.
            </p>
            <p>
              1.3 "Ether" means the utility token of the Ethereum Blockchain
              that may be used to purchase computational resources to run
              decentralised applications or perform actions on such Blockchain.
            </p>
            <p>
              1.4 "Ethereum Address" means the unique public key cryptocurrency
              identifier that points to an Ethereum-compatible wallet to which
              Ether may be sent or stored.
            </p>
            <p>
              1.5 "Ethereum Blockchain" means the underlying blockchain
              infrastructure Ribbon leverages to offer its Services.
            </p>
            <p>
              1.6 "Governmental Authority" means the applicable domestic or
              foreign federal, provincial or state, municipal, local or other
              governmental, regulatory, judicial or administrative authority.
            </p>
            <p>
              1.7 "Portal" means the Ribbon website located at "ribbon.finance",
              and all associated sites linked thereto by Ribbon and its
              Affiliates, including Ribbon's decentralised application layer on
              the Ethereum Blockchain.
            </p>
            <p>
              1.8 "Services" The Products offered by Ribbon as accessible
              through the Portal.
            </p>
            <p>
              1.9 "Product" means any product offered through the Services and
              available in the Portal.
            </p>
          </span>
        ),
      },
      {
        question: "2. ELIGIBLE USERS",
        answer: (
          <span>
            <p>
              The following are conditions of access to the Portal, and each
              time you access the Portal, the User represents and warrants to us
              that:
            </p>
            <p>
              1. The User is an individual that is 18 years of age or older,
              capable of forming a binding contract with us, and under no legal
              impediment or incapability;
            </p>
            <p>
              2. The User is an authorised representative of a company and have
              the authority from that company to access the Portal and form a
              binding agreement with us on behalf of that company;
            </p>
            <p>
              3. The User is not identified as a "Specially Designated National"
              by the US Office of Foreign Assets Control or otherwise subject to
              any sanctions or restrictions which may affect our ability to
              provide the User with our Services;
            </p>
            <p>
              4. The User has the full power and authority to agree to these
              Terms and to use any Service offered by Ribbon through the Portal;
            </p>
            <p>
              5. The User has read the Risk Sections and the Product Terms of
              Use prior to using any Service, and that you are solely
              responsible for your trading or non-trading actions and have had
              the opportunity to take any legal, financial, accounting or other
              advice that you deem appropriate prior to accessing the Portal or
              using any of the Services;
            </p>
            <p>
              6. The User will only trade with legally obtained digital assets
              that belong to The User, and that The User has full legal and
              beneficial title to any such assets at the time The User transfers
              them to us;
            </p>
            <p>
              7. The User is not located in, or a resident of, any Restricted
              Territory (as defined below) and has not used any technical means
              to misrepresent its geographical location to access the Portal
              from any Restricted Territory; and
            </p>
            <p>
              8. The User is acting for its own account as principal and not as
              trustee, agent or otherwise on behalf of any other persons
            </p>
            <p>
              Your access to the Portal and any Services may be restricted based
              on your jurisdiction or geographical location. You must not use
              the Protocol if you are located in or a citizen or resident of any
              state, country, territory or other jurisdiction in which use of
              the Portal or the Services would be illegal or otherwise violate
              any applicable law (a “Restricted Territory”). The fact that the
              Portal is accessible in a Restricted Territory or that the Portal
              allows the use of the official language of a Restricted Territory
              or a language commonly used in a Restricted Territory must not be
              construed as a license to use the Portal in such a Restricted
              Territory. We unconditionally reserve the right to restrict access
              to any Restricted Territory and may implement technical controls
              to prevent access to the Portal or any Services from any
              Restricted Territory. No services are offered to persons or
              entities who reside in, are citizens of, are located in, are
              incorporated in, or have a registered office in any restricted
              territory (as defined below). (a) Belarus, Cuba, Democratic
              People’s Republic of Korea (DPRK), Democratic Republic of Congo,
              Iran, Lebanon, Libya, Mali, Myanmar, Nicaragua, Russia, Somalia,
              South Sudan, Sudan, Syria, the following regions of Ukraine:
              Crimea, Donetsk and Luhansk, or any other country or region that
              is the subject of comprehensive country-wide or region-wide or
              economic sanctions by the United Nations, United States of
              America, the European Union or the United Kingdom; and (b) United
              States of America, the United Kingdom, Canada, and the People’s
              Republic of China.
            </p>
          </span>
        ),
      },
      {
        question: "3. MODIFICATIONS TO THESE TERMS",
        answer: (
          <span>
            <p>
              In our sole discretion, we reserve the right to modify these Terms
              from time to time. If modifications are made, Ribbon will provide
              the User with notice of such changes by providing a notice through
              our Services or updating the date at the top of these Terms.
            </p>
            <p>
              Unless we say otherwise in our notice, all such modifications are
              effective immediately, and your continued use of our Services
              after we provide such notice will be construed as a consensual
              confirmation of the notified changes.
            </p>
            <p>
              Where the User does not agree with the modified Terms, such User
              is to cease from using Ribbon's Services at once.
            </p>
          </span>
        ),
      },
      {
        question: "4. SERVICES",
        answer: (
          <span>
            <p>
              4.1 Ethereum Gas Fees - Ribbon's Services involve the use of the
              Ethereum Blockchain, which requires the payment of a fee, commonly
              known as the "Ethereum Gas Fee," for the computational resources
              required to conduct a transaction on the Ethereum Blockchain
              successfully. You acknowledge and agree that Ribbon has no control
              over: (1) any Ethereum blockchain transactions; (2) The method of
              payment of any Ethereum Gas Fees; and (3) Any actual payments of
              Ethereum Gas Fees. Accordingly, the User must ensure that he has a
              sufficient balance of Ether stored at his Ethereum Address to
              complete an Ethereum Blockchain transaction.
            </p>
            <p>
              4.2 Conditions and Restrictions - Ribbon may, at any time and in
              its sole discretion, restrict the User's access to, or otherwise
              impose conditions or restrictions upon such User's use of, the
              Services or the Portal, with or without prior notice. You
              acknowledge that we may or may not be in a position to provide
              information about the reasons for such closure or suspension.
            </p>
            <p>
              4.3 No Broker, Legal or Fiduciary Relationship - Ribbon is not the
              User's broker, lawyer, intermediary, agent, or advisor and has no
              fiduciary relationship or obligation to the User regarding any
              other decisions or activities that the User effects when using
              Ribbon's Portal or Services. No communication or information
              provided by Ribbon to the User is intended or to be construed as
              advice by such User.
            </p>
            <p>
              4.4 User's Responsibility - As a condition to accessing or using
              Ribbon's Portal or Services, the User shall: (a) Only use Ribbon's
              Portal and or Services for lawful purposes, and in accordance with
              these Terms; (b) Ensure that, at all times, all information that
              the User provides on the Portal is current, complete and accurate;
              and (c) Maintain the security and confidentiality of his Ethereum
              public and private keys.
            </p>
            <p>
              4.5 Unacceptable Use or Conduct - As a condition for accessing or
              using Ribbon's Portal or Services, the User shall not: (a) Violate
              any Applicable Law, including, without limitation, any relevant
              and applicable anti-money laundering and anti-terrorist financing
              laws, each as may be amended from time to time; (b) Infringe on or
              misappropriate any contract, intellectual property or other
              third-party rights, or commit acts of tortious liability while
              using Ribbon's Portal or Services; (c) Use Ribbon's Services in
              any manner that could interfere with, disrupt, negatively affect,
              or inhibit other users from fully enjoying the Services or that
              could damage, disable, overburden, or impair the functioning of
              the Services in any manner; (d) Attempt to circumvent any content
              filtering mechanisms or security measures that Ribbon employs on
              the Portal, or attempt to access any Service or area of the Portal
              or Services that the User is not authorised to access; (e) Use the
              Services to pay for, support, or otherwise engage in any illegal
              gambling activities, fraud, money-laundering, terrorist
              activities, or other illegal activities; (f) Use any robot,
              spider, crawler, scraper, or other automated means or interface
              not provided by Ribbon to access the Services or to extract data;
              (g) Introduce any malware, virus, Trojan horse, worm, logic bomb,
              drop-dead device, backdoor, shutdown mechanism or other harmful
              material into the Portal or the Services; (h) Provide false,
              inaccurate, or misleading information; (i) Post content or
              communications on the Portal that are, in our sole discretion,
              libelous, defamatory, profane, obscene, pornographic, sexually
              explicit, indecent, lewd, vulgar, suggestive, harassing, hateful,
              threatening, offensive, discriminatory, bigoted, abusive,
              inflammatory, fraudulent, deceptive or otherwise objectionable;
              (j) Post content on the Portal containing unsolicited promotions,
              political campaigning, or commercial messages or any chain
              messages or user content designed to deceive or trick the user of
              the Service; (k) Use Ribbon's Portal or Services from a Restricted
              Territory; (l) Encourage or induce any third party to engage in
              any activities prohibited under this Section.
            </p>
            <p>
              4.6 Your Assumption of Risks - The User represents and warrants
              that Ribbon will have no responsibility or liability for any of
              the risks mentioned in Sections 5, 6, 7 and 8.
            </p>
            <p>
              The User hereby irrevocably waives, releases and discharges all
              claims, whether known or unknown, against Ribbon, its affiliates
              and their respective shareholders, members, directors, officers,
              employees, agents and representatives related to any of the risks
              set forth herein.
            </p>
            <p>
              4.7 Your Content - The User hereby grants to Ribbon a
              royalty-free, fully paid-up, sublicensable, transferable,
              perpetual, irrevocable, non-exclusive, worldwide license to use,
              copy, modify, create derivative works of, display, perform,
              publish and distribute, in any form, medium or manner, any content
              that is available to other users via the Portal as a result of the
              User's use of the Portal (collectively, "Your Content").
            </p>
            <p>
              This includes, without limitation, content for promoting Ribbon
              (or its Affiliates), the Services or the Portal. The User
              represents and warrants the following: (a) The User owns his
              content or has the right to grant the rights and licenses in these
              Terms; and (b) The User's Content and Ribbon's use of the User's
              Content, as licensed herein, does not violate or infringe on any
              third party's rights.
            </p>
          </span>
        ),
      },
      {
        question: "5. DIGITAL ASSET RISKS",
        answer: (
          <span>
            <p>
              5.1 Digital Assets: Digital asset prices are volatile and
              fluctuate day to day. Trading in these digital assets may be
              considered a high-risk activity. Proper diligence and sound
              judgement should be used in evaluating the risks associated with
              these activities. We do not solicit nor represent that digital
              assets are an investment vehicle. The decision to trade digital
              assets rests entirely on the users' independent judgement. Any
              digital asset may decrease in value or lose value due to various
              factors, including the discovery of wrongful conduct, market
              manipulation, change to the nature or properties of a digital
              asset, or governmental or regulatory activity. Demand for digital
              assets may be partially or wholly driven by speculation or market
              sentiment.
            </p>
            <p>
              5.2 Lack of Information available: You may not have full access to
              all the information relevant to the particular Digital Asset or
              its underlying platform or network. It may not be possible to
              obtain updated information regarding the progress or any changes
              to particular Digital Assets or their underlying platforms or
              network. Many Digital Asset issuers or operators may also have no
              operating history or track record that any be used to evaluate the
              ability to achieve their stated project goals.
            </p>
            <p>
              5.3 Network Events: Digital Assets may be subject to various
              Network Events, including Forks, Airdrops, attacks on the
              security, integrity or operation of the networks, or Network
              Participants making a binding decision in relation to the network
              underlying a Digital Asset. Such events may affect the features,
              functions, operation, use or other properties of any Digital
              Asset, Network or platform. The events may also severely impact
              the price or value of any Digital Assets or even result in the
              shutdown of the network or platform associated with the Digital
              Asset. Such Network Events may be beyond the control of the User
              or Ribbon, or to the extent Ribbon has any ability to impact the
              Network Event, Ribbon's decision or actions may not be in your
              interests. Where you transfer digital assets to Ribbon which are
              the subject of a Network Event, you may not be entitled to the
              proceeds arising from any Network Event, and Ribbon is entitled to
              keep any digital assets created because of Network Events (for
              example, in circumstances where there is a fork in the network).
              The User should not transfer assets to Ribbon, where you wish to
              receive the benefits of those Network Events.
            </p>
            <p>
              5.4 Inflation Risk: Digital Assets may, either because of the
              inherent design of the digital asset or through Network Events,
              not be a fixed supply of assets. Where additional Digital Assets
              are created, the asset's price may decline due to the inflationary
              effects of adding additional Digital Assets to the total assets
              available.
            </p>
            <p>
              5.5 Concentration Risk: At any point in time, one or more persons
              may directly or indirectly control significant portions of the
              total supply of any particular Digital Asset. Acting individually
              or in concert, these holders may have significant influence over
              the Digital Asset and may be able to influence or cause Network
              Events which may have a detrimental effect on the price, value or
              functionality of the Digital Assets. Network Participants may make
              decisions which may not be in the User's best interest as a holder
              of Digital Assets.
            </p>
            <p>
              5.6 Suspensions of Trading/Network Events: Under certain
              conditions, liquidating a position in Digital Assets may be
              difficult or impossible. Certain Network Events (including total
              failure of a network) may occur rapidly and affect the ability of
              holders of Digital Assets to conduct transactions. Information
              relating to these Network Events may be difficult to ascertain
              ahead of time and may be subject to limited oversight by any third
              party capable of intervening to stabilise the network.
            </p>
          </span>
        ),
      },
      {
        question: "6. Cybersecurity Risks",
        answer: (
          <span>
            <p>
              6.1 Source code changes and flaws: The various source codes
              underlying Digital Assets and smart contracts are subject to
              change and may at any time contain one or more defects,
              weaknesses, inconsistencies, errors or bugs. Unless otherwise
              represented in writing by Ribbon, no audit or investigation has
              been conducted on any source code produced by parties other than
              Ribbon.
            </p>
            <p>
              6.2 Cryptographic advancements: Developments in cryptographic
              technologies and techniques, including the advancement of
              artificial intelligence or quantum computing, pose security risks
              to all cryptography-based systems, including Digital Assets.
              Applying these technologies and techniques to Digital Assets or
              the Ribbon Portal and Services may result in theft, loss,
              disappearance, destruction, devaluation or other compromises of
              digital assets, the Ribbon Portal and Services or your data.
            </p>
            <p>
              6.3 Reliance on the Internet: Digital Assets and the Ribbon Portal
              and Services rely heavily on the Internet. However, the public
              nature of the Internet means that either part of the Internet or
              the entire Internet may be unreliable or unavailable at any given
              time. Further, interruption, delay, corruption or loss of data,
              the loss of confidentiality in the transmission of data, or the
              transmission of malware may occur when transmitting data via the
              Internet. The result of the above may be that your order is not
              executed according to your instructions or not at all at the
              desired time.
            </p>
            <p>
              6.4 Unauthorised access: Unauthorised third parties may use the
              User wallet and effect transactions without your knowledge or
              authorisation, whether by obtaining control over another device or
              account used by the User or other methods.
            </p>
            <p>
              6.5 Loss of Private Key(s): Losing control of your private key(s)
              may permanently and irreversibly deny you access to digital
              assets. Neither Ribbon nor any other person will be able to
              retrieve or protect digital assets for which you hold the private
              key(s). If the private key(s) is lost, it may become impossible to
              transfer digital assets to any other address or wallet, and you
              are solely responsible for securing your private key(s) in a
              manner that meets the User security circumstances.
            </p>
            <p>
              6.6 Operational Risk: Breakdowns or malfunctioning of essential
              systems and controls, including IT systems or Digital Asset
              networks, may generally affect digital assets' value. In
              particular, digital assets may suffer from a concentration of
              operational risk during development, including key personnel,
              governance and financial control risk.
            </p>
          </span>
        ),
      },
      {
        question: "7. LEGAL RISKS",
        answer: (
          <span>
            <p>
              7.1 Country Risk: If an investment is made in any Digital Assets
              issued by a party subject to foreign laws or transactions made on
              markets in other jurisdictions, including markets formally linked
              to a domestic market, recovery of the sums invested and any
              profits or gains may be reduced, delayed or prevented by exchange
              controls, debt moratorium or other actions imposed by the
              government or other official bodies. Before you use any Product,
              you should be familiar with any rules or laws relevant to the
              Services. Your local regulatory authority will be unable to compel
              the enforcement of the rules of regulatory authorities or markets
              in other jurisdictions where your transactions have been effected.
              You should obtain independent advice about the different types of
              redress available in both your home jurisdiction and other
              relevant jurisdictions before you start to trade. If your country
              of residence imposes restrictions on Digital Assets, we may be
              required to discontinue your access to the Portal and Services. We
              may not be permitted to transfer Digital Assets held in the
              Products back to the User or permit the User to transfer Digital
              Assets out of the Ribbon Services to the User or others until the
              regulatory environment permits us to do so.
            </p>
            <p>
              7.2 Taxation and required reporting to taxation authorities: You
              are responsible for all taxes in respect of any gains obtained in
              a Product, including past or retrospective taxes imposed on the
              Services. Before using any Product, you should understand the tax
              implications of acquiring, entering into, holding and disposing of
              a Digital Asset and a Product. Tax implications of any Service
              depend on the nature of your business activities and the Product
              in question. The User should consult their independent tax advisor
              to understand the relevant tax considerations.
            </p>
            <p>
              7.3 Regulatory Uncertainty: The Services are potentially exposed
              to regulatory/legal risk. The legal and regulatory treatment of
              Digital Assets may change. Regulation of Digital Assets is
              unsettled and rapidly changing. Legal and regulatory treatment
              varies according to the jurisdiction. The effect of regulatory
              legal risk is that any Digital Asset may decrease in value or lose
              all of its value due to legal or regulatory change. This may
              affect the value or potential profit of a Product. Legal changes
              may make a previously acceptable investment illegal or subject to
              substantial restrictions that may affect the ability to liquidate
              a position. Changes to related issues such as taxation may occur
              and radically affect the value or profitability of a Digital
              Asset. Such risk is unpredictable and depends on geopolitical,
              economic, sovereign and other factors. Risks may be asymmetrical
              between established and emerging markets and affect some Digital
              Assets significantly more than others. Ribbon recommends that the
              User obtains independent legal, tax and financial advice and
              continues to monitor the legal and regulatory position in respect
              of its use of the Services.
            </p>
            <p>
              7.4 Legal status of digital assets, Services and Portal: The laws
              of various jurisdictions may apply to Digital Assets or Services
              offered through the Ribbon Portal. Applying these laws and
              regulations to Digital Assets is largely untested, and laws and
              regulations are subject to change without prior notice to either
              Ribbon or the User. In particular, any current governmental or
              regulatory tolerance of Digital Assets may change rapidly, and
              Digital Assets may at any time be deemed to be a security,
              investment, asset or money by governmental authorities or
              regulators, which will affect Ribbon's ability to offer the
              Services. As a result of regulation and legislation around Digital
              Assets, the Portal may not be available in certain jurisdictions
              or at all. Changes to access to the Portal or the Services may be
              made unilaterally on short or no notice to the User. Ribbon may
              receive formal or informal queries, notices, requests or warnings
              by governmental authorities and regulators. Governmental
              authorities and regulators may take action against Ribbon. As a
              result of such events, Ribbon may be required to discontinue the
              Portal or Services. The User may also be subject to governmental
              or regulatory action by holding Digital Assets or using the Ribbon
              Portal and Services. The User should take independent legal advice
              to evaluate the consequences of using the Services before
              accepting this Terms of Use or using the Services.
            </p>
          </span>
        ),
      },
      {
        question: "8. GENERAL RISKS",
        answer: (
          <span>
            <p>
              8.1 Suitability: You should decide to use any Service provided by
              Ribbon only after due and careful consideration. You should
              determine whether a Product is appropriate in light of your
              experience in similar transactions, your objectives in engaging
              with Ribbon, financial resources and other relevant circumstances.
              If you are unsure that the Product is suitable, you should obtain
              independent legal, tax or financial advice.
            </p>
            <p>
              8.2 Fees: Before using the Services, the User should obtain
              details of all commissions, fees and other charges for which the
              User will be liable.
            </p>
            <p>
              8.3 Not a Research Report: Any content provided by Ribbon does not
              purport to be, and is not intended to be, a "research report" or
              "investment research".
            </p>
            <p>
              8.4 Commercial Arrangements: Ribbon may have a relationship with
              other entities which may not be disclosed to you.
            </p>
          </span>
        ),
      },
      {
        question: "9. PRIVACY",
        answer: (
          <span>
            <p>
              Please refer to Ribbon's privacy policy at
              https://ribbon.finance/privacy for information about how Ribbon
              collects, stores, and processes information about the User.
            </p>
          </span>
        ),
      },
      {
        question: "10. PROPRIETARY RIGHTS",
        answer: (
          <span>
            <p>
              10.1 Intellectual Property Rights Ownership: Ribbon owns all
              intellectual property and other rights in the Portal, together
              with their contents, including, but not limited to, software,
              text, images, trademarks, service marks, copyrights, patents, and
              designs. Unless expressly authorised by Ribbon, the User may not
              copy, modify, adapt, rent, license, sell, publish, distribute, or
              otherwise permit any third party to access or use Ribbon's Portal
              with its contents. Accessing or using Ribbon's Portal or Services
              does not constitute a grant to you of any proprietary intellectual
              property or other rights in the Interface or its contents.
            </p>
            <p>
              10.2 Trademarks: Any of Ribbon's names, logos, and other marks
              used in the Portal or as a part of the Services, including
              Ribbon's name and logo, are trademarks owned by Ribbon, its
              Affiliates or its applicable licensors. You may not copy, imitate
              or use such Trademarks without Ribbon's (or the applicable
              licensor's) prior written consent.
            </p>
          </span>
        ),
      },
      {
        question: "11. CHANGES, SUSPENSION AND TERMINATION",
        answer: (
          <span>
            <p>
              11.1 Changes to Services: Ribbon may, in its sole discretion, from
              time to time and with or without prior notice to the User, modify,
              suspend or disable, temporarily or permanently, the Portal or the
              Services, in whole or in part, for any reason whatsoever,
              including, but not limited to, as a result of a security incident.
            </p>
            <p>
              11.2 No Liability: Ribbon will not be liable for any losses
              suffered by the User resulting from any modification to the Portal
              or any Services or from any suspension or termination, for any
              reason, of your access to all or any portion of Ribbon's Portal or
              Services.
            </p>
            <p>
              11.3 Survival: These Terms will survive any termination of your
              access to Ribbon's Portal or Services, regardless of the reasons
              for its expiration or termination, in addition to any other
              provision which by law or by its nature should survive.
            </p>
          </span>
        ),
      },
      {
        question: "12. ELECTRONIC NOTICES",
        answer: (
          <span>
            <p>
              The User consents to receive all communications, agreements,
              documents, receipts, notices, and disclosures electronically
              (collectively, our "Communications") that Ribbon provides in
              connection with these Terms or any Services. The User agrees that
              Ribbon may provide Communications to him by posting them on the
              Portal or by emailing them to the User at the email address
              provided in connection with the User's use of the Services if any.
              The User should maintain copies of Ribbon's Communications by
              printing a paper copy or saving an electronic copy. The User may
              also contact Ribbon's support team to request additional
              electronic copies of Communications by filing a support request at
              julian@ribbon.finance.
            </p>
          </span>
        ),
      },
      {
        question: "13. INDEMNIFICATION",
        answer: (
          <span>
            <p>
              The User will defend, indemnify, and hold harmless Ribbon, its
              Affiliates, and its Affiliates' respective shareholders, members,
              directors, officers, employees, attorneys, agents,
              representatives, suppliers and contractors (collectively,
              "Indemnified Parties") from any claim, demand, lawsuit, action,
              proceeding, investigation, liability, damage, loss, cost or
              expense, including without limitation reasonable attorneys' fees,
              arising out of or relating to: (a) The User's use of, or conduct
              in connection with, the Portal or the Services; (b) Ethereum
              Blockchain assets associated with the User's Ethereum Address; (c)
              Any feedback or user content the User provides to the Portal if
              any; (d) The User's violation of these Terms; or (e) The User's
              infringement or misappropriation of the rights of any other person
              or entity.
            </p>
            <p>
              If the User is obliged to indemnify any Indemnified Party, Ribbon
              (or, at its discretion, the applicable Indemnified Party) will
              have the right, in its sole discretion, to control any action or
              proceeding and to determine whether Ribbon wishes to settle, and
              if so, on what terms.
            </p>
          </span>
        ),
      },
      {
        question: "14. DISCLOSURES AND DISCLAIMERS",
        answer: (
          <span>
            <p>
              The Portal and the Services are provided on an "as is" and "as
              available" basis. The Indemnified Parties make no guarantees in
              connection with the Portal or the Services. To the maximum extent
              permitted under applicable law, the Indemnified Parties disclaim
              all warranties and conditions, whether express or implied, of
              merchantability, fitness for a particular purpose, or
              non-infringement and disclaim all responsibility and liability
              for: (1) The Portal or the Services is accurate, complete,
              current, reliable, uninterrupted, timely, secure, or error-free.
              Information (including, without limitation, the value or outcome
              of any transaction) available through the Portal is provided for
              general information only and should not be relied upon or used as
              the sole basis for making decisions. Any reliance on the Services
              is at your own risk; (2) You expressly acknowledge, understand,
              and agree that the Services may contain audio-visual effects,
              strobe lights or other materials that may affect your physical
              senses or physical condition. (3) The User expressly acknowledges
              that the Indemnified Parties are not liable for loss or damage
              caused by another User's conduct, unauthorised actors, or any
              unauthorised access to or use of the Portal or Services; and (4)
              Viruses, worms, trojan horses, time bombs, cancelbots, spiders,
              malware or other types of malicious code that may be used to
              affect the functionality or operation of the Portal or Services.
            </p>
          </span>
        ),
      },
      {
        question: "15. LIMITATION OF LIABILITY",
        answer: (
          <span>
            <p>
              The Indemnified Parties shall, in no event, be liable for any
              incidental, indirect, special, punitive, consequential or similar
              damages or liabilities whatsoever (including, without limitation,
              damages for loss of data, information, revenue, goodwill, profits
              or other business or financial benefit) arising out of or in
              connection with the Portal and the Services (and any of their
              content and functionality), any execution or settlement of a
              transaction, any performance or nonperformance of the Services,
              the User's Ether, Product outcome, Service or other item provided
              by or on behalf of Ribbon, whether under contract, tort (including
              negligence), civil liability, statute, strict liability, breach of
              warranties, or under any other theory of liability, and whether or
              not Ribbon has been advised of, knew of or should have known of
              the possibility of such damages and notwithstanding any failure of
              the essential purpose of these Terms or any limited remedy
              hereunder. This limitation of liability shall apply to the fullest
              extent permitted by law.
            </p>
          </span>
        ),
      },
      {
        question: "16. RELEASE OF CLAIMS ",
        answer: (
          <span>
            <p>
              You expressly agree that you assume all risks concerning your
              access to and use of Ribbon's Portal or Services. Additionally,
              you expressly waive and release us from any liability, claims,
              causes of action, or damages arising from or in any way relating
              to your access to and use of Ribbon's Portal or Services.
            </p>
          </span>
        ),
      },
      {
        question: "17. THIRD-PARTY RESOURCES AND PROMOTIONS",
        answer: (
          <span>
            <p>
              Ribbon's Portal or Services may contain references or links to
              third-party resources, including, but not limited to, information,
              materials, products, or services that we do not own or control. In
              addition, third parties may offer promotions related to your
              access and use of Ribbon's Portal or Services. We do not endorse
              or assume responsibility for such resources or promotions. If you
              access any such resources or participate in such promotions, you
              do so at your own risk, and you understand that the Terms do not
              apply to your dealings or relationships with any third parties.
              You expressly relieve us of any liability arising from your use of
              any such resources or participation in any such promotions.
            </p>
          </span>
        ),
      },
      {
        question: "18. GOVERNING LAW AND DISPUTE RESOLUTION",
        answer: (
          <span>
            <p>
              These Terms shall be governed by, and construed in accordance
              with, the laws of the Republic of Singapore.
            </p>
            <p>
              We will use our best efforts to resolve potential disputes through
              informal, good-faith negotiations. If a potential dispute arises,
              you must first contact us by email at admin@ribbon.finance so we
              can attempt to resolve it without resorting to formal dispute
              resolution. If we cannot reach an informal resolution, then you
              and Ribbon agree to determine the potential dispute according to
              the process below.
            </p>
            <p>
              This arbitration agreement shall be governed by the laws of the
              Republic of Singapore;
            </p>
            <p>The seat of arbitration will be in the Republic of Singapore.</p>
            <p>
              The number of arbitrators will be one, and that arbitrator must
              have relevant legal and technological expertise and may be Ribbon
              or the Chairman of the SIAC.
            </p>
            <p>The language of the arbitration shall be English.</p>
            <p>
              Notwithstanding any other provision of these Terms, you agree that
              Ribbon has the right to apply for injunctive remedies (or an
              equivalent type of urgent legal relief) in any jurisdiction.
            </p>
          </span>
        ),
      },
      {
        question: "19. ENTIRE AGREEMENT",
        answer: (
          <span>
            <p>
              The Terms, including the Privacy Policy, constitute the entire
              agreement between the User and Ribbon with respect to the subject
              matter hereof. The Terms, including the Privacy Policy, supersede
              any prior or contemporaneous written or oral agreements,
              communications and other understandings relating to the subject
              matter of the Terms.
            </p>
          </span>
        ),
      },
    ],
  },
];

const TermsPage = () => {
  usePullUp();

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
          <PolicyTitle>Terms and Conditions</PolicyTitle>
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

export default TermsPage;

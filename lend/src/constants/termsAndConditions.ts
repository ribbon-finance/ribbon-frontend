import { PoolOptions } from "shared/lib/constants/lendConstants";

/**
 * IMPORTANT: Ensure you edit the api-ribbon termsAndConditions.ts to exactly match this if any changes are made
 * We use the local api-ribbon contract to check against the signed message from the T&C generated from this file
 */

export const getMarketMakerLegalName = (pool: PoolOptions) => {
  switch (pool) {
    case "wintermute":
      return "WINTERMUTE TRADING LTD";
    case "folkvang":
      return "";
    // case "amber":
    //   return "AMBER TECHNOLOGIES LIMITED";
  }
};

// For now we won't display T&C for wintermute or folkvang
// If enabling for wintermute or folkvang, ensure useApproveTermsAndConditions.tsx is updated
export const getMarketMakerEmail = (pool: PoolOptions) => {
  switch (pool) {
    case "wintermute":
      return "";
    case "folkvang":
      return "";
    // TODO uncomment once amber PR merged
    // case "amber":
    //     return "otc@ambergroup.io";
  }
};

export const getMarketMakerNameCapitalized = (pool: PoolOptions) => {
  switch (pool) {
    case "wintermute":
      return "Wintermute";
    case "folkvang":
      return "Folkvang";
    // TODO uncomment once amber PR merged
    // case "amber":
    //     return "Amber";
  }
};

// For now we won't display T&C for wintermute or folkvang
// If enabling for wintermute or folkvang, ensure useApproveTermsAndConditions.tsx is updated
export const getMarketMakerIncorporatedCountry = (pool: PoolOptions) => {
  switch (pool) {
    case "wintermute":
      return "";
    case "folkvang":
      return "";
    // TODO uncomment once amber PR merged
    //   case "amber":
    //       return "British Virgin Islands";
  }
};

export const getPoolTermsAndConditions = (pool: PoolOptions) => {
  const legalName = getMarketMakerLegalName(pool);
  const email = getMarketMakerEmail(pool);
  const capitalizedName = getMarketMakerNameCapitalized(pool);
  const country = getMarketMakerIncorporatedCountry(pool);

  return `TERMS AND CONDITIONS OF THE ${legalName} VAULT

These Terms and Conditions (the "Terms") enter into force upon the first Transfer made by the Lender ("Effective Date") to the Vault of ${legalName} ("${capitalizedName}" or "Borrower"), a company incorporated under the laws of ${country} and the Lender being the person who has agreed to these Terms and subsequently Transferred Crypto Assets in the Borrower's Vault. The Lender and the Borrower are each as individually, a "Party," and collectively the "Parties".

RECITALS

WHEREAS subject to the terms and conditions of these Terms, the Lender may enter into a Loan in which the Lender will lend to the Borrower certain Crypto Assets in an uncollateralised manner. Each such Transfer from the Lender to the Borrower shall be referred to herein as a Loan and shall be governed by these Terms. 

NOW, THEREFORE, in consideration of the foregoing and other good and valuable consideration, the receipt and sufficiency of which hereby acknowledged, the Lender hereby agrees to the following:

I.	Definitions.

"Acceleration Notice" means a Notice in writing given by the Borrower to the Lender in the case of an Illegality or Force Majeure Event, notifying the Lender that such event is to be treated as accelerating the termination of:

In the case of an Event of Default, all Loans; or
In the case of an Illegality or a Force Majeure Event, the Loans affected by such Illegality or Force Majeure Event, in each case on the date specified in such Notice (which shall be no earlier than three Business Days following the date on which such Acceleration Notice becomes effective) (the "Acceleration Date").

"Applicable Law" means the law of England and Wales;

"Base Currency" means the US Dollar, otherwise known as USD.

"Borrowed Amount" refers to the value of the Loaned Assets in the Base Currency on the Loan Effective  Date.

"Business Day" means a day on which the Borrower is open for business. For the purposes of these Terms, the Borrower is open on all calendar weekdays unless it is Christmas Day or New Year's Day according to the UK calendar.

"Crypto Asset" means any crypto asset the Borrower and Lender agree upon.

"Crypto Asset Address" means an identifier of alphanumeric characters that represents a digital identity or destination for transactions of Crypto Asset(s).

"Equivalent" means, with respect to Loaned Assets, the equivalent to those Loaned Assets. Crypto Assets are "equivalent to" other Crypto Assets for the purposes of these Terms if they are of an identical type, nominal value, description and (except where otherwise stated) amount as those other Crypto Assets. Any Equivalent New Tokens required pursuant to these Terms to be Transferred by Borrower to Lender but not yet Transferred shall constitute Equivalent Loaned Assets.

"Force Majeure Event" means that, after giving effect to any applicable provision, disruption fallback or remedy specified in, or pursuant to, these Terms, by reason of force majeure or act  of state occurring after a Loan is entered into, on any day the office through which a Party makes and receives payments or deliveries (which term shall include, without limitation, Transfers) with respect to such Loan is prevented from performing any absolute or contingent obligation to make a payment or delivery in respect of such Loan, from receiving a payment or delivery in respect of such Loan or from complying with any other material provision of these Terms relating to such Loan (or would be so prevented if such payment, delivery or compliance were required on that day), or it becomes impossible or impracticable for such office so to perform, receive or comply (or it would be impossible or impracticable for such office so to perform, receive or comply if such payment, delivery or compliance were required on that day) so long as the force majeure or act of state is beyond the control of such office or such Party and such office or Party could not, after using all reasonable efforts (which will not require such Party to incur a loss, other than immaterial, incidental expenses), overcome such prevention, impossibility or impracticability.

"Illegality" means that, after giving effect to any applicable provision, disruption fallback or remedy specified in, or pursuant to, these Terms, due to an event or circumstance (other than any action taken by a Party) occurring after a Loan is entered into, it becomes unlawful under any Applicable Law (including without limitation the laws of any country in which payment, delivery or compliance is required by the Parties), on any day, or it would be unlawful if the relevant payment, delivery or compliance were required on that day for the office through which such Party makes and receives payments or deliveries with respect to such Loan to perform any absolute or contingent obligation to make a payment or transfer in respect of such Loan, to receive a payment or delivery in respect of such transaction or to comply with any other material provision of these Terms relating to such Loan.

"Loan" means a loan of Crypto Assets made pursuant to and in accordance with these Terms.

"Loan Balance" means, on any day and in respect of any Loan, the sum of all outstanding amounts of Loaned Assets (as reduced by any Transfer of Equivalent Loaned Assets in accordance with these Terms on or prior to such day), including Equivalent New Crypto Assets, in respect of such Loan.

"Loan Effective Date" means the date upon which a Loan begins.

"Loaned Assets" means any Crypto Assets Transferred in a Loan hereunder by the Lender to the Borrower's Vault. 

“Notice” means any notice referred to in these Terms which shall be made public on the Vault’s frontend or communicated by the Lender to the Borrower via the following electronic mail address ${email}.

"Vault" means a smart contract solution for Borrowers to Transfer the Crypto Asset(s) and Lenders to borrow and repay such Crypto Assets.

"Recall Ability" means the right of the Lender to demand repayment of a portion or the entirety of the Loan Balance at any time, subject to these Terms and, in particular, Section II.

"Termination Date" means the date upon which a Loan is terminated.

"Transfer" of Loaned Assets or Equivalent Loaned Assets means; in relation to Crypto Assets, the payment of the Crypto Assets to the Vault's designated Crypto Asset Address by the Parties and the satisfaction of each of the conditions set out in these Terms (and "Transferred" and "Transferring" shall be construed accordingly).

"USD" or "US Dollars" means the lawful currency of the United States of America.

II.	General Loan Terms.

(a)	Loans of Crypto Assets

Subject to the terms and conditions hereof, the Borrower may, in its sole and absolute discretion, withdraw funds from the ${legalName} Vault containing the Crypto Assets that the Lender Transfers. 

(b)	Loan Repayment Procedure

Repayment of Loan

Whenever a Loan is terminated for whatever scenario under II(c), the Borrower has the obligation to repay the entirety of the Loaned Assets, including interest accrued as per II(c)(iii), to the Lender. 

Recall Ability

The Lender has a Recall Ability, wherein the Lender may, in its sole and absolute discretion, withdraw a portion or the entirety of the Loan Balance the Lender would have Transferred in the ${legalName} Vault. 

In the event of a Recall Ability where the Lender withdraws only a portion of the Loan Balance, the remaining Loan Balance shall continue to accrue interest as per II (b)(i) above on a pro-rata basis.

Interest Repayment

Interest rates shall change according to the utilisation rate or percentage of the Vault's liquidity that the Borrower uses at any time following a specific curve. 

Interest is accumulated for each block which immediately raises the Borrower's utilisation rate.

Interest shall be immediately paid to the Lender from the liquidity of the Vault itself. 

The Borrower may choose the frequency and amount of each repayment, provided that the utilisation rate does not exceed a specified level established by governance.


(c)	Termination of Loan

A Loan will terminate upon:

The repayment of the Loan following the termination of the ${legalName} Vault;

The Acceleration Date specified in an Acceleration Notice given by a Non- Defaulting Party to a Defaulting Party as a result of the occurrence of an Event of Default;

The Acceleration Date specified in an Acceleration Notice given by either Party as  a result of the occurrence of an Illegality or Force Majeure Event; or

The withdrawal of the Loaned Assets Transferred by the Lender.

Termination of a Loan shall not terminate, limit, or otherwise affect the terms of these Terms except as specified in Section II.

In the event of a termination of a Loan and all Equivalent Loaned Assets relating to such Loan shall be Transferred, if effected in the manner provided for in (c)(i)(ii)(iii) not later than three (3) Business Days following such termination.

III.	Loan Fees and Transaction Fees.

(a)	Transaction Fees

Neither Borrower nor Lender shall be liable to the other Party for any transaction fees incurred in the course of lending or borrowing Crypto Assets under these Terms.

(b)	Taxes and Fees

Neither Borrower nor Lender shall have any liability to the other Party for any taxes due under these Terms.

IV.	Representations, Warranties and Covenants.

The Parties hereby make the following representations and warranties, which shall continue during the term of these Terms and any Loan hereunder:

Each Party represents and warrants that 

It has the power to execute and deliver these Terms, to enter into the Loans contemplated hereby and to perform its obligations hereunder; 
It has taken all necessary action to authorise such execution, delivery and performance; and 
These Terms constitute a legal, valid, and binding obligation enforceable against it in accordance with its terms.

Each Party hereto represents and warrants that it has not relied on the other for any tax or accounting advice concerning these Terms and that it has made its own determination as to the tax and accounting treatment of any Loan or any Crypto Asset Transferred hereunder.

Each Party hereto represents and warrants that it is acting for its own account.

Each Party hereto represents and warrants that it is a sophisticated party and thoroughly familiar with the inherent risks involved in the Transfer(s) contemplated in these terms, including, without limitation, risk of new financial regulatory requirements, potential loss of capital and risks due to volatility of the price of the Loaned Assets, and voluntarily takes full responsibility for any risk to that effect.

Each Party represents and warrants that it is not insolvent and is not subject to bankruptcy or insolvency proceedings under any Applicable Laws.

Each Party represents and warrants there are no proceedings pending or, to its knowledge, threatened, which could reasonably be anticipated to have any material adverse effect on the Transfers contemplated by these Terms or the accuracy of the representations and warranties hereunder or thereunder.

The Lender represents and warrants that it has, or will have at the time of the Transfer of any of the Loaned Assets, the right to Transfer such Loaned Assets, as applicable, subject to the terms and conditions hereof, and free and clear of all liens and encumbrances.

The Borrower represents and warrants that it has, or will have at the time of the Transfer of any Loaned Assets, the right to Transfer such Loaned Assets, as applicable, subject to the terms and conditions hereof, and free and clear of all liens and encumbrances.

Each Party represents and warrants that it has all consents of any governmental or other authority that are required to be obtained by it with respect to these Terms to which it is a Party and will use all reasonable efforts to maintain these in full force and effect, and obtain any that may become necessary in the future.


The Lender represents and warrants that, to the best of its knowledge and belief, no Crypto Assets, as Loaned Assets, is or is related to the proceeds of criminal activity.

The Lender represents and warrants that he has sufficient information upon which the Lender is able to unequivocally base the decision to lend Crypto Assets to the Borrower.

V.	Default.

Any of the following events in respect of a Party (the "Defaulting Party") shall constitute an event of default and shall be herein referred to as an "Event of Default" or "Events of Default":

The failure of the Borrower to Transfer all Equivalent Loaned Assets upon the termination of any Loan; provided, however, the Borrower shall have two (2) Business Days to cure such default;

Any bankruptcy, insolvency, reorganisation, or liquidation proceedings or other proceedings for the relief of debtors or dissolution proceedings that are instituted by or against a Party and are not dismissed within thirty (30) days of the initiation of said proceedings; or

Any representation or warranty made by either Party that is proven to be incorrect or untrue in any material respect as of the date of making or deemed making thereof, however, a Party shall have ten (10) Business Days to cure such default.

In the event that under (a), the Borrower does not cure such default within the two (2) Business Days, the Lender would have the right to seek legal remedy in accordance with these Terms. 

An event or circumstance that constitutes or gives rise to an Illegality or a Force Majeure Event will not, for so long as that is the case, also constitute or give rise to an Event of Default insofar as such event or circumstance relates to the failure to make any payment or delivery or a failure to comply with any other material provision of these Terms.

Except in the circumstances contemplated by the preceding paragraph, if an event or circumstance which would otherwise constitute or give rise to an Illegality or a Force Majeure Event also constitutes an Event of Default, it will be treated as an Event of Default and will not constitute or give rise to an Illegality or a Force Majeure Event. 

VI.	Transfer of Title.

The Borrower shall be entitled to use the Loaned Assets Transferred to it in any manner, including transferring such Loaned Assets to any account or wallet or for any other purpose.

The Borrower shall be obliged to Transfer Equivalent Crypto Assets plus the accrued interest as per II(b)(i) to the Lender, as applicable. 

VII.	Rights and Remedies Cumulative.

No delay or omission by a Party in exercising any right or remedy hereunder shall serve as a waiver of the future exercise of that right or remedy or any other rights or remedies hereunder. Each Party's rights are cumulative and, in addition to all other rights provided by law, in equity.

VIII.	Survival of Rights and Remedies.

All remedies hereunder and all obligations concerning any Loan shall survive the termination of the relevant Loan, return of Loaned Assets, and termination of these Terms.

IX.	Governing Law; Dispute Resolution.

These Terms, and any non-contractual rights or obligations arising out of or in relation to it, are governed by and shall be construed and enforced under the laws of England and Wales. The English courts shall have exclusive jurisdiction to settle any dispute (whether contractual or non-contractual and including a dispute relating to the existence, validity or termination of these Terms) arising out of these Terms. 

X.	Third Parties Rights.

A person who is not a party to these Terms has no right to enforce or to enjoy the benefit of any provisions contained herein.

XI.	Modifications.

All modifications or amendments to these Terms shall be effective only when reduced to writing and agreed to once again by the Lender.
 
XII.	Entire Terms.

These Terms, each exhibit referenced herein, constitute the entire Terms among the parties with respect to the subject matter hereof and supersede any prior negotiations, understandings and agreements concerning these Terms. 

XIII.	Successors and Assigns.

These Terms shall bind and inure to the benefit of the respective successors and assigns of the Parties. The Borrower may assign these Terms or any rights or duties hereunder upon written Notice to the Lender. 

XIV.	Severability of Provisions.

Each provision of these Terms shall be viewed as separate and distinct, and in the event that any provision shall be deemed by a court of competent jurisdiction to be illegal, invalid or unenforceable, the court finding such illegality, invalidity or unenforceability shall modify or reform these Terms to give as much effect as possible to such provision. Any provision that cannot be modified or reformed shall be deleted, and the remaining provisions of these Terms shall continue in full force and effect.

XV.	Relationship of Parties.

Nothing contained in these Terms shall be deemed or construed by the Parties, or by any third party, to create the relationship of partnership or joint venture between the Parties hereto, it being understood and agreed that no Terms contained herein shall be deemed to create any relationship between the parties hereto other than the relationship of the Borrower and the Lender.

XVI.	No Waiver.

The failure of or delay by either Party to enforce an obligation or exercise a right or remedy under any provision of these Terms or to exercise any election in these Terms shall not be construed as a waiver of such provision, and the waiver of a particular obligation in one circumstance will not prevent such Party from subsequently requiring compliance with the obligation or exercising the right or remedy in the future. No waiver or modification by either Party of any provision of these Terms shall be deemed to have been made unless expressed in writing and signed by both parties.

XVII.	Indemnification.

Borrower shall indemnify and hold harmless the Lender for any claims, demands, losses, expenses and liabilities arising out of or relating to the Borrower’s bad faith, gross negligence, or wilful misconduct in the performance of its duties under these Terms.

XVIII.	Term and Termination.

The applicability of these Terms shall commence upon the first deposit made by the Lender and shall automatically terminate as per Section II(c) above.

XIX.	Miscellaneous.

Whenever used herein, the singular number shall include the plural, the singular, and the use of the masculine, feminine, or neuter gender shall include all genders where necessary and appropriate. The section headings are for convenience only and shall not affect the interpretation or construction of these Terms. 
`;
};

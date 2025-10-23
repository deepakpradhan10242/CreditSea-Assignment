function mapXmlToReport(root) {
  const profile = root.INProfileResponse || root;

  const applicant =
    profile?.Current_Application?.Current_Application_Details
      ?.Current_Applicant_Details || {};
  const caisSummary = profile?.CAIS_Account?.CAIS_Summary || {};
  const totalBalances = caisSummary?.Total_Outstanding_Balance || {};

  const safeNum = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  };

  // --- BASIC DETAILS ---
  const basic = {
    firstName: applicant.First_Name || "",
    lastName: applicant.Last_Name || "",
    mobile: applicant.MobilePhoneNumber || "",
    pan: "",
  };

  // --- SUMMARY ---
  const summary = {
    totalAccounts: safeNum(caisSummary?.Credit_Account?.CreditAccountTotal),
    activeAccounts: safeNum(caisSummary?.Credit_Account?.CreditAccountActive),
    closedAccounts: safeNum(caisSummary?.Credit_Account?.CreditAccountClosed),
    outstandingAll: safeNum(totalBalances?.Outstanding_Balance_All),
    outstandingSecured: safeNum(totalBalances?.Outstanding_Balance_Secured),
    outstandingUnsecured: safeNum(totalBalances?.Outstanding_Balance_UnSecured),
    last7daysEnquiries: safeNum(profile?.TotalCAPS_Summary?.TotalCAPSLast7Days),
  };

  // --- ACCOUNTS ---
  const details = profile?.CAIS_Account?.CAIS_Account_DETAILS;
  const accountsArr = Array.isArray(details)
    ? details
    : details
    ? [details]
    : [];

  const accounts = accountsArr.map((a) => {
    const holder = a?.CAIS_Holder_Details || {};
    const addr = a?.CAIS_Holder_Address_Details || {};
    const idDetails = a?.CAIS_Holder_ID_Details || {};

    // Extract PAN from ID section if exists
    const panCandidate =
      idDetails.Income_TAX_PAN || holder.Income_TAX_PAN || "";

    if (panCandidate && !basic.pan) basic.pan = panCandidate;

    const holderName = [
      holder.First_Name_Non_Normalized,
      holder.Surname_Non_Normalized,
    ]
      .filter(Boolean)
      .join(" ")
      .trim();

    //  Structured address (object)
    const holderAddress = {
      line1: addr.First_Line_Of_Address_non_normalized || "",
      line2: addr.Second_Line_Of_Address_non_normalized || "",
      city: addr.City_non_normalized || "",
      state: addr.State_non_normalized || "",
      postalCode: addr.ZIP_Postal_Code_non_normalized || "",
      country: addr.CountryCode_non_normalized || "",
    };

    return {
      bank: (a.Subscriber_Name || "").trim(),
      accountNumber: a.Account_Number || "",
      portfolioType: a.Portfolio_Type || "",
      accountType: a.Account_Type || "",
      currentBalance: safeNum(a.Current_Balance),
      amountPastDue: safeNum(a.Amount_Past_Due),
      openDate: a.Open_Date || "",
      dateReported: a.Date_Reported || "",
      holderName,
      holderAddress,
    };
  });

  // ---CREDIT SCORE ---
  const score = safeNum(profile?.SCORE?.BureauScore);

  return { basic, summary, accounts, score };
}

module.exports = { mapXmlToReport };

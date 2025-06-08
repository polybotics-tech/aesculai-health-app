const HealthLibrary = {
  imaging_modalities: [
    "X-ray",
    "Ultrasound",
    "CT Scan (Computed Tomography)",
    "MRI (Magnetic Resonance Imaging)",
    "PET Scan (Positron Emission Tomography)",
    "Mammography",
    "Fluoroscopy",
    "Echocardiography",
    "Nuclear Medicine Imaging",
    "Angiography",
    "Interventional Radiology",
  ],
  imaging_body_regions: [
    "Head",
    "Brain",
    "Face",
    "Neck",
    "Throat",
    "Chest",
    "Lungs",
    "Heart",
    "Abdomen",
    "Liver",
    "Gallbladder",
    "Pancreas",
    "Spleen",
    "Stomach",
    "Kidneys",
    "Bladder",
    "Pelvis",
    "Uterus",
    "Ovaries",
    "Prostate",
    "Rectum",
    "Spine",
    "Back",
    "Bones",
    "Joints",
    "Shoulder",
    "Elbow",
    "Wrist",
    "Hand",
    "Leg",
    "Hip",
    "Knee",
    "Ankle",
    "Foot",
    "Blood Vessels",
    "Breast",
    "Eyes",
    "Ears",
    "Nose",
    "Sinuses",
    "Thyroid",
    "Muscles",
    "Skin (for superficial masses or lesions)",
  ],
  genders: ["Male", "Female"],
  weight_units: ["Kilogram (kg)", "Pounds (lbs)", "Tonnes (t)"],
  height_units: ["Centimeter (cm)", "Meter (m)", "Inches (inch)", "Feet"],
  medical_search_terms: [
    "hypertension",
    "diabetes",
    "mellitus",
    "asthma",
    "cardiovascular",
    "disease",
    "stroke",
    "breast",
    "cancer",
    "depression",
    "anxiety",
    "disorder",
    "tuberculosis",
    "COVID",
    "HIV",
    "AIDS",
    "malaria",
    "pneumonia",
    "arthritis",
    "chronic",
    "kidney",
    "obesity",
    "anemia",
    "hepatitis",
    "sickle cell",
    "mental",
    "health",
  ],
  weird_policy_text: `Privacy Policy for Aesculai Health App
Last Updated: June 1, 2025

This Privacy Policy describes how Aesculai ("we," "us," or "our") handles information in connection with your use of the Aesculai mobile application (the "App"). Your privacy is important to us, and we are committed to transparency about how we treat data.

Aesculai is designed as a healthcare simulation and educational tool. It is not intended for use with real patient data or for providing medical advice for actual patient care.

Data We Do NOT Collect or Store Related to Patient Health Information
1. Simulated Patient Data:
When you use features such as the Symptom & History Input or the Drug Lookup, you may enter details that resemble patient symptoms, medical history, or drug information.
This input is treated as simulated data for the purpose of providing diagnostic suggestions, drug information, or learning scenarios within the app session only.
2. No Storage of Simulated Data:
We do not store, save, or retain any of the simulated patient data you enter.
This data is processed ephemerally (used temporarily for the simulation/request to our AI/database APIs) and is discarded once the simulation request is completed or your app session ends.
This data is not linked back to you or any individual, as it is not real patient information.
3. No Real Patient Health Information:
We explicitly prohibit the input of real Protected Health Information (PHI) or any data that could identify a real patient into the App.
The App is not designed or secured to handle such sensitive information. You are solely responsible for ensuring that no real PHI is entered.
Other Data Collected (Standard for App Use)
1. User Account Information:
If you create an account to use Aesculai, we collect information such as your email address and a secure password for login and account management purposes.
We also store your chosen user role (e.g., "Practicing Doctor," "Medical Student") to tailor the app experience and features.
2. Usage Data:
We may collect anonymized and aggregated data about how you interact with the App. This may include, for example, which features are used most frequently, the duration of user sessions, general user flow patterns, and technical error reports.
This usage data is strictly anonymized and cannot be used to identify you personally.
It does not contain any simulated patient information.
We use this data solely to improve the App's functionality, performance, user experience, and for troubleshooting.
How We Use Your Information
The information we collect is used for the following purposes:

To Provide and Maintain the App: To allow you to create an account, log in, and use the features of Aesculai according to your selected role.
To Personalize Your Experience: To tailor certain features or content based on your user role (e.g., "Practicing Doctor" vs. "Medical Student").
To Improve the App: To understand how users interact with Aesculai, identify areas for improvement, enhance existing features, develop new features, and fix bugs or technical issues.
To Communicate With You: We may use your email address to send you important information about your account, updates to the App, or changes to our terms or policies. You can opt-out of non-essential communications.
To Ensure Security: To protect against unauthorized access to your account and to maintain the integrity of our services.
How We Protect Data
We implement reasonable administrative, technical, and physical security measures to protect your User Account Information against loss, theft, misuse, and unauthorized access, disclosure, alteration, and destruction.

Passwords are securely hashed.
Communication with our backend services (where applicable for account management) is encrypted.
However, please remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your information, we cannot guarantee its absolute security.

Third-Party Services Used
Aesculai integrates with third-party services to provide its core functionality. These include:

Artificial Intelligence (AI) APIs (e.g., Google Gemini API): When you use features that involve AI-powered suggestions (like symptom analysis or diagnostic support), the simulated data you input is sent to these APIs for processing. These APIs process the data ephemerally to generate a response for the simulation. As stated, this simulated data is not stored by us, and our agreements with these API providers typically stipulate that they do not retain this ephemeral data for their own long-term use beyond what is necessary to provide the service. We encourage you to review the privacy policies of these AI service providers.
Drug Database APIs: For the Drug Lookup feature, queries may be made to external drug information databases. These queries involve the drug name (simulated) and do not include any user-identifiable information or simulated patient data.
Backend Services (e.g., Supabase/Firebase): For user authentication and storing User Account Information (email, hashed password, user role) and potentially anonymized Usage Data. These platforms provide their own robust security measures.
We select third-party services that have strong privacy and security practices. However, their use of your information is governed by their own privacy policies.

Your Rights and Choices
Account Information: You can review and update your account information (email, role) through the App's settings, if such functionality is provided.
Deleting Your Account: You may be able to delete your account from within the App or by contacting us. Deleting your account will remove your User Account Information from our active databases. Anonymized Usage Data may be retained as it is not linked to you.
Opt-out of Communications: You can opt-out of receiving promotional emails from us by following the unsubscribe link or instructions provided in any email we send.
Children's Privacy
Aesculai is not intended for use by individuals under the age of 18, or the age of majority in their jurisdiction, whichever is older. We do not knowingly collect personal information from children. If we become aware that a child has provided us with personal information without parental consent, we will take steps to delete such information.

Changes to This Privacy Policy
We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the new Privacy Policy on this page and/or by sending you an email or an in-app notification. We will update the "Last Updated" date at the top of this Privacy Policy.

You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.

Contact Us
If you have any questions about this Privacy Policy, please contact us at: aesculaiorg1@gmail.com

By creating an account and using the Aesculai App, you acknowledge that you have read, understood, and agree to the terms of this Privacy Policy.`,
};

export default HealthLibrary;

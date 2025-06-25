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
Last Updated: June 1st, 2025

This Privacy Policy describes how Aesculai ("we," "us," or "our") handles information in connection with your use of the Aesculai Health App (the "App"). Your privacy is important to us, and we are committed to transparency about how we treat data.

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
  weird_terms_use_text: `Terms of Use for Aesculai Health App
Last Updated: June 2nd, 2025

Welcome to Aesculai! Please read these Terms of Use ("Terms") carefully before using the Aesculai Health App ("App"), provided by Aesculai ("Creator," "we," "us," or "our").

By downloading, installing, accessing, or using the App, you agree to be bound by these Terms. If you do not agree with any part of these Terms, you may not use the App.

1. Nature of the Service & Critical Disclaimer

1.1 Purpose: Aesculai is designed and intended SOLELY as a health simulation and learning tool for healthcare professionals and medical students. It provides simulated clinical scenarios, access to simulated or educational medical information (including simulated drug details, AI-assisted interpretation of educational/sample imaging), and tools to practice clinical reasoning and workflow.

1.2 NO REAL PATIENT DATA: You understand and agree that you MUST NOT input, store, or process any real patient identifying information or real patient health data in the App. The App is intended for use with hypothetical, simulated, or educational data only.

1.3 NOT FOR CLINICAL USE: The App and its outputs (including diagnosis suggestions, drug information, imaging interpretations, or any other content) are FOR SIMULATION AND EDUCATIONAL PURPOSES ONLY. They are NOT intended for, and MUST NOT be used for, providing medical advice, diagnosing, treating, or managing actual patients.

1.4 NO SUBSTITUTE FOR PROFESSIONAL JUDGMENT: The App is not a substitute for professional medical training, knowledge, experience, or independent professional judgment. Always rely on your own clinical expertise, validated medical sources, and consult with qualified healthcare professionals for actual patient care decisions.

1.5 AI & Data Limitations: The App utilizes artificial intelligence (AI) and databases which may contain inaccuracies, errors, or incomplete information. The outputs are simulations and suggestions, not definitive or guaranteed correct medical conclusions.

By using this App, you acknowledge and agree to these fundamental limitations and disclaimers.

2. Eligibility

You must be a healthcare professional (such as a physician, resident, or other licensed practitioner) or a medical student to use this App. By using the App, you represent and warrant that you meet this eligibility criteria and are at least 18 years of age.

3. Account Registration & Security

3.1 You may need to register for an account to access certain features. You agree to provide accurate and complete information during registration, including your role (Practicing Professional or Medical Student).
3.2 You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
3.3 You agree to notify us immediately of any unauthorized use of your account. We are not liable for any loss or damage arising from your failure to protect your account information.

4. User Conduct

You agree to use the App only for its intended simulation and learning purposes and in compliance with these Terms. You agree not to:

4.1 Use the App for any unlawful purpose or in violation of any applicable laws or regulations.
4.2 Input or attempt to input any real patient data or protected health information.
4.3 Use the App for diagnosing, treating, or managing actual patients.
4.4 Copy, modify, distribute, sell, or lease any part of the App or its content, unless specifically allowed.
4.5 Attempt to gain unauthorized access to the App or its related systems or networks.
4.6 Use the App in any way that could damage, disable, overburden, or impair the App.
4.7 Use any automated means (like bots) to access the App without our permission.

5. Intellectual Property

The App, its content, features, and functionality (including text, graphics, logos, icons, code, and design) are the exclusive property of the Creator and are protected by copyright, trademark, and other intellectual property laws. You may not use any of the Creator's trademarks or trade dress without our prior written permission.

6. Third-Party Services

The App may utilize third-party services, APIs, or content (e.g., AI models, databases for simulation data). Your use of the App may also be subject to the terms and conditions of these third parties. We are not responsible for the availability, accuracy, or practices of such third-party services.

7. Disclaimer of Warranties

The App is provided on an "as is" and "as available" basis, without any warranties of any kind, either express or implied.

Without limiting the foregoing, we specifically disclaim all warranties, whether express or implied, statutory or otherwise, including but not limited to any warranties of merchantability, fitness for a particular purpose, accuracy, reliability, non-infringement, or that the App will be error-free or uninterrupted.

We make no warranty or representation regarding the accuracy, completeness, or usefulness of any information or output provided by the App for any purpose, particularly for real medical applications.

8. Limitation of Liability

To the fullest extent permitted by law, the Creator shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses, resulting from (a) your use or inability to use the App; (b) any conduct or content of any third party on the App; (c) any content obtained from the App; and (d) unauthorized access, use, or alteration of your transmissions or content, whether based on warranty, contract, tort (including negligence), or any other legal theory, whether or not we have been informed of the possibility of such damage.

In no event shall the Creator's total liability to you for all damages exceed the amount paid by you to the Creator, if any, for accessing the App during the twelve (12) months immediately preceding the claim, or if you have not paid, the sum of fifty U.S. dollars ($50).

You specifically acknowledge that the Creator is not liable for the defamatory, offensive, or illegal conduct of other users or third parties and that the risk of injury from the foregoing rests entirely with you.

Crucially, you agree that the Creator shall have NO LIABILITY WHATSOEVER for any consequences, damages, or harm resulting from your use of the App for real patient care, diagnosis, treatment, or management, or for your input of any real patient data, which actions are strictly prohibited by these Terms.

9. Indemnification

You agree to defend, indemnify, and hold harmless the Creator and its affiliates, officers, agents, employees, and partners from and against any and all claims, damages, obligations, losses, liabilities, costs, or debt, and expenses (including but not limited to attorney's fees) arising from: (a) your use of and access to the App, including any data or content transmitted or received by you; (b) your violation of any term of these Terms; (c) your violation of any third-party right; or (d) your violation of any applicable law, rule, or regulation, especially including any claims arising from your prohibited use of the App for real patient care or with real patient data.

10. Termination

We may terminate or suspend your access to the App immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach these Terms (most critically, the prohibitions on using for real patients or inputting real data). Upon termination, your right to use the App will immediately cease.

11. Governing Law

 These Terms shall be governed by and construed in accordance with the laws of Nigeria.

12. Changes to Terms

We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice of material changes, such as by posting the new Terms on the App or our website. By continuing to access or use the App after any revisions become effective, you agree to be bound by the revised Terms.

13. Contact Us

If you have any questions about these Terms, please contact us at aesculaiorg1@gmail.com.`,
};

export default HealthLibrary;

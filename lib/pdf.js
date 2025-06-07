import StringLibrary from "./string";

const PdfLibrary = {
  generate_html_content__imaging_analysis: (
    analysis,
    base64Image,
    base64Logo
  ) => {
    if (!analysis) return `<html></html>`;

    const {
      ai_confidence_in_result_percentange,
      descriptive_analysis,
      possible_diagnosis,
      analysis_details,
      recommendations,
    } = analysis;

    //--
    const _format = StringLibrary.format_confidence_by_percentage(
      ai_confidence_in_result_percentange
    );

    return `
    <html>
  <head>
    <title>Aesculai | Imaging Analysis Result</title>
  </head>

  <style>
    @import url("https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap");

    :root {
      --black-color: #070808;
      --white-color: #f7fbfc;
      --gray50-color: #f0f7fa;
      --gray100-color: #c1c7c9;
      --gray200-color: #757778;
      --primary-color: #38b5e2;
      --primary-faded-color: rgba(56, 181, 226, 0.08);
      --success-color: #81c784;
      --success-faded-color: rgba(28, 189, 74, 0.08);
      --error-color: #e33241;
      --error-faded-color: rgba(227, 50, 65, 0.08);

      --h1: 32px;
      --h2: 26px;
      --h3: 24px;
      --h4: 18px;
      --p: 16px;

      --w-h1: 700;
      --w-h2: 700;
      --w-h3: 600;
      --w-h4: 500;
      --w-p: 400;
    }

    *,
    body {
      padding: 0;
      margin: 0;
      box-sizing: border-box;
    }

    body {
      background-color: var(--white-color);
      font-family: "Poppins", Verdana, Tahoma, sans-serif;
      font-size: var(--p);
      font-weight: var(--w-p);
      line-height: calc(var(--p) + 4px);
      color: var(--gray200-color);
    }

    main {
      padding: 64px 32px;
      max-width: 720px;
      margin-left: auto;
      margin-right: auto;
      display: flex;
      flex-direction: column;
      gap: 32px;
    }

    h1 {
      font-size: var(--h1);
      font-weight: var(--w-h1);
      line-height: calc(var(--h1) + 4px);
      padding-bottom: 32px;
      color: var(--black-color);
    }

    h2 {
      font-size: var(--h2);
      font-weight: var(--w-h2);
      line-height: calc(var(--h2) - 4px);
      padding-top: 18px;
      padding-bottom: 8px;
      color: var(--black-color);
    }

    h3 {
      font-size: var(--h3);
      font-weight: var(--w-h3);
      line-height: calc(var(--h3) + 4px);
      padding-bottom: 8px;
      color: var(--black-color);
    }

    h4 {
      font-size: var(--h4);
      font-weight: var(--w-h4);
      line-height: calc(var(--h4) + 2px);
      color: var(--black-color);
    }

    h5,
    strong {
      font-size: var(--p);
      font-weight: var(--w-h3);
      line-height: calc(var(--h4) + 4px);
      color: var(--gray200-color);
    }

    p {
      font-size: var(--p);
      font-weight: var(--w-p);
      line-height: calc(var(--p) + 2px);
      color: var(--gray200-color);
    }

    a {
      font-weight: var(--w-h3);
      color: var(--primary-color);
      text-decoration: none;
    }

    .text-center {
      text-align: center;
    }

    .light-text {
      color: var(--gray100-color);
    }

    .card {
      width: 100%;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      border-radius: 16px;
      border: 1px solid #c1c7c9;
    }

    .small-card {
      width: fit-content;
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      background: var(--white-color);
      border-radius: 8px;
    }

    .flex-list {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      gap: 12px;
    }

    .flex-list-col {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .long-card {
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      gap: 8px;
    }

    .dot {
      width: 14px;
      min-width: 14px;
      height: 14px;
      border-radius: 100px;
      border: 2px solid var(--gray100-color);
    }

    .logo {
        width: 48px;
        height: 48px;
    }

    .image {
        margin-top: 20px;
        margin-bottom: 20px;
        text-align: center;
    }

    img {
        max-width: 100%;
        height: auto;
        max-height: 95vh;
        border: 1px solid #c1c7c9;
        border-radius: 8px;
    }

  </style>

  <body>
    <main>
      <div>
      <!--logo photo-->
        <div class="logo">
            <img src="data:image/png;base64,${base64Logo}" />
        </div>

        <h2 class="text-center">Imaging Analysis Results</h1>

        <!--imaging photo-->
        <div class="image">
            <img src="data:image/jpeg;base64,${base64Image}" />
        </div>
      </div>

      <!--ai confidence and summary-->
      <div class="card">
        <h4>AI Confidence: ${
          _format?.context
        } [${ai_confidence_in_result_percentange}%]</h4>

        <p>${descriptive_analysis}</p>
      </div>

      <!--possible diagnosis-->
      <div class="card">
        <h4>Possible Diagnosis</h4>
        <p>${possible_diagnosis}</p>
      </div>

      <!--analysis breakdown-->
      <div class="card">
        <h4>Analysis Details Breakdown</h4>

        <div class="flex-list">
          <!--dynamically populate-->
          ${
            analysis_details && analysis_details?.length > 0
              ? analysis_details
                  ?.map(
                    (item) => `<div class="small-card">
            <h5>${item?.title}</h5>
            <p class="light-text">${item?.details}</p>
          </div>`
                  )
                  ?.join("")
              : `<p>No breakdown available</p>`
          }
        </div>
      </div>

      <!--recommendations-->
      <div class="card">
        <h4>Recommendations</h4>

        <div class="flex-list-col">
          <!--dynamically populate-->
          ${
            recommendations && recommendations?.length > 0
              ? recommendations
                  ?.map(
                    (item) =>
                      `<div class='long-card'><div class="dot"></div><p>${item}</p></div>`
                  )
                  .join("")
              : `<p>No recommendations available</p>`
          }
        </div>
      </div>
    </main>
  </body>
</html>
    `;
  },
  generate_html_content__assessment_analysis: (analysis, bio, base64Logo) => {
    if (!analysis || !bio) return `<html></html>`;

    const {
      ai_confidence_in_result_percentange,
      descriptive_analysis,
      possible_diagnosis,
      analysis_details,
      recommendations,
    } = analysis;

    const { gender, age, weight, weight_unit, height, height_unit } = bio;

    //--
    const _format = StringLibrary.format_confidence_by_percentage(
      ai_confidence_in_result_percentange
    );

    return `
    <html>
  <head>
    <title>Aesculai | Assessment Analysis Result</title>
  </head>

  <style>
    @import url("https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap");

    :root {
      --black-color: #070808;
      --white-color: #f7fbfc;
      --gray50-color: #f0f7fa;
      --gray100-color: #c1c7c9;
      --gray200-color: #757778;
      --primary-color: #38b5e2;
      --primary-faded-color: rgba(56, 181, 226, 0.08);
      --success-color: #81c784;
      --success-faded-color: rgba(28, 189, 74, 0.08);
      --error-color: #e33241;
      --error-faded-color: rgba(227, 50, 65, 0.08);

      --h1: 32px;
      --h2: 26px;
      --h3: 24px;
      --h4: 18px;
      --p: 16px;

      --w-h1: 700;
      --w-h2: 700;
      --w-h3: 600;
      --w-h4: 500;
      --w-p: 400;
    }

    *,
    body {
      padding: 0;
      margin: 0;
      box-sizing: border-box;
    }

    body {
      background-color: var(--white-color);
      font-family: "Poppins", Verdana, Tahoma, sans-serif;
      font-size: var(--p);
      font-weight: var(--w-p);
      line-height: calc(var(--p) + 4px);
      color: var(--gray200-color);
    }

    main {
      padding: 64px 32px;
      max-width: 720px;
      margin-left: auto;
      margin-right: auto;
      display: flex;
      flex-direction: column;
      gap: 32px;
    }

    h1 {
      font-size: var(--h1);
      font-weight: var(--w-h1);
      line-height: calc(var(--h1) + 4px);
      padding-bottom: 32px;
      color: var(--black-color);
    }

    h2 {
      font-size: var(--h2);
      font-weight: var(--w-h2);
      line-height: calc(var(--h2) - 4px);
      padding-top: 18px;
      padding-bottom: 8px;
      color: var(--black-color);
    }

    h3 {
      font-size: var(--h3);
      font-weight: var(--w-h3);
      line-height: calc(var(--h3) + 4px);
      padding-bottom: 8px;
      color: var(--black-color);
    }

    h4 {
      font-size: var(--h4);
      font-weight: var(--w-h4);
      line-height: calc(var(--h4) + 2px);
      color: var(--black-color);
    }

    h5,
    strong {
      font-size: var(--p);
      font-weight: var(--w-h3);
      line-height: calc(var(--h4) + 4px);
      color: var(--gray200-color);
    }

    p {
      font-size: var(--p);
      font-weight: var(--w-p);
      line-height: calc(var(--p) + 2px);
      color: var(--gray200-color);
    }

    a {
      font-weight: var(--w-h3);
      color: var(--primary-color);
      text-decoration: none;
    }

    .text-center {
      text-align: center;
    }

    .light-text {
      color: var(--gray100-color);
    }

    .card {
      width: 100%;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      border-radius: 16px;
      border: 1px solid #c1c7c9;
    }

    .small-card {
      width: fit-content;
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      background: var(--white-color);
      border-radius: 8px;
    }

    .flex-list {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      gap: 12px;
    }

    .flex-list-col {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .long-card {
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      gap: 8px;
    }

    .dot {
      width: 14px;
      min-width: 14px;
      height: 14px;
      border-radius: 100px;
      border: 2px solid var(--gray100-color);
    }

    .logo {
        width: 48px;
        height: 48px;
    }

    .image {
        margin-top: 20px;
        margin-bottom: 20px;
        text-align: center;
    }

    img {
        max-width: 100%;
        height: auto;
        max-height: 95vh;
        border: 1px solid #c1c7c9;
        border-radius: 8px;
    }

  </style>

  <body>
    <main>
      <div>
      <!--logo photo-->
        <div class="logo">
            <img src="data:image/png;base64,${base64Logo}" />
        </div>

        <h2 class="text-center">Assessment Analysis Results</h1>
      </div>

      <!--ai confidence and summary-->
      <div class="card">
        <h4>AI Confidence: ${
          _format?.context
        } [${ai_confidence_in_result_percentange}%]</h4>

        <p>${descriptive_analysis}</p>
      </div>

      <!--bio data breakdown-->
      <div class="card">
        <h4>Patient Bio Data</h4>

        <div class="flex-list">
          <div class="small-card">
            <h5>Gender (Sex)</h5>
            <p class="light-text">${gender}</p>
          </div>

          <div class="small-card">
            <h5>Age (Estimated)</h5>
            <p class="light-text">${age}</p>
          </div>

          <div class="small-card">
            <h5>Weight (Estimated)</h5>
            <p class="light-text">${weight} ${weight_unit}</p>
          </div>

          <div class="small-card">
            <h5>Height (Estimated)</h5>
            <p class="light-text">${height} ${height_unit}</p>
          </div>
        </div>
      </div>

      <!--possible diagnosis-->
      <div class="card">
        <h4>Possible Diagnosis</h4>
        <p>${possible_diagnosis}</p>
      </div>

      <!--analysis breakdown-->
      <div class="card">
        <h4>Analysis Details Breakdown</h4>

        <div class="flex-list">
          <!--dynamically populate-->
          ${
            analysis_details && analysis_details?.length > 0
              ? analysis_details
                  ?.map(
                    (item) => `<div class="small-card">
            <h5>${item?.title}</h5>
            <p class="light-text">${item?.details}</p>
          </div>`
                  )
                  ?.join("")
              : `<p>No breakdown available</p>`
          }
        </div>
      </div>

      <!--recommendations-->
      <div class="card">
        <h4>Recommendations</h4>

        <div class="flex-list-col">
          <!--dynamically populate-->
          ${
            recommendations && recommendations?.length > 0
              ? recommendations
                  ?.map(
                    (item) =>
                      `<div class='long-card'><div class="dot"></div><p>${item}</p></div>`
                  )
                  ?.join("")
              : `<p>No recommendations available</p>`
          }
        </div>
      </div>
    </main>
  </body>
</html>
    `;
  },
};

export default PdfLibrary;

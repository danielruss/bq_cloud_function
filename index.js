const { BigQuery } = require('@google-cloud/bigquery');

async function countRows(projectId, datasetId, tableId) {
    const bigquery = new BigQuery({ projectId });

    // Construct the query to count rows
    const query = `SELECT COUNT(*) AS row_count FROM \`${projectId}.${datasetId}.${tableId}\``;

    // Execute the query
    const [rows] = await bigquery.query(query);

    // Extract the row count from the results
    const rowCount = rows[0].row_count;

    // Get the current date
    const currentDate = new Date();

    // Create the JSON response
    const response = {
        date: currentDate.toISOString(),
        rowCount: rowCount
    };

    console.log(response);

    return response;
}

exports.countRowsFunction = async (req, res) => {
    const projectId = 'nih-nci-dceg-druss';
    const datasetId = 'DansDataset';
    const tableId = 'Fake2';

    const result = await countRows(projectId, datasetId, tableId);
    console.log(result)

    res.status(200).json(result)
};

exports.helloWorld = (req, res) => {
    res.status(200).send('Hello from Cloud Functions!');
};

const { GoogleAuth } = require('google-auth-library');
const auth = new GoogleAuth();
exports.getServiceAccount = async (req, res) => {
    try {
        const client = await auth.getClient();
        const projectId = await auth.getProjectId();
        const url = `http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/email`;
        const metadataOptions = {
            headers: {
                'Metadata-Flavor': 'Google'
            }
        };

        const response = await client.request({ url, ...metadataOptions });
        const serviceAccountEmail = response.data;

        res.status(200).send(`Service Account: `, serviceAccountEmail);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving service account');
    }
};

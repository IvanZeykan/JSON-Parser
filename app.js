const{promises: fs} = require ('fs');
const { title } = require('process');

const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const csvWriter = createCsvWriter({
    path: './response.csv',
    header: [ 
                'Contact Name', 
                'Contact Title', 
                'Contact LinkedIn Profile', 
                'Contact Location', 
                'Company Name', 
                'Company Website', 
                'Company Size',
                'Revenue', 
                'Company LinkedIn'
             ].map((item) => ({id: item, title: item }))
})

async function main (){
    const file_data = await fs.readFile('response (1).json');
    const parsed_data = JSON.parse(file_data);

    for (const user of parsed_data.contacts.results){
        
        user['Contact Name'] = user.name.full
        user['Contact Title'] = user.job_title.title
        user['Contact LinkedIn Profile'] = user.social_link
        user['Contact Location'] = user.location.country + ', ' + user.location.country_iso2

        const userCompanyId = user.metadata.company_lid 
        const uniqueCompanies = parsed_data.contacts.unique_companies 
        
        user['Company Name'] = uniqueCompanies[userCompanyId].name
        user['Company Website'] = uniqueCompanies[userCompanyId].industry_clustering.website
        user['Company Size'] = uniqueCompanies[userCompanyId].company_size.min + '-' + uniqueCompanies[userCompanyId].company_size.max
        user['Revenue'] = uniqueCompanies[userCompanyId].revenue_range.string
        user['Company LinkedIn'] = uniqueCompanies[userCompanyId].social.linkedin

    }
    

    try {
        await csvWriter.writeRecords(parsed_data.contacts.results);
    } catch (error) {
     console.log(error);   
    }
}
main();
# XPRTZ technology radar

This repository contains the XPRTZ technology radar.

Technology Radar:
- [View the Technology Radar](https://radar.thoughtworks.com/?sheetId=https%3A%2F%2Fraw.githack.com%2Fxprtz%2Fradar%2Fmaster%2Fradar.csv)
- [Edit YAML file](https://github.com/xprtz/radar/edit/master/radar.yaml)
- [Convert YAML to CSV](https://jsonformatter.org/yaml-to-csv/?url=https://raw.githack.com/xprtz/radar/master/radar.yaml) - copy CSV output after conversion
- [Edit CSV file for pasting](https://github.com/xprtz/radar/edit/master/radar.csv)

## Edit radars on local machine

Besides the above approach with editing the content of the radar directly in Github, convert it with an online 
tool and write it back to github, there is also a more advanced approach:

1. Clone this repo
2. Execute ```npm run dev:radar ``` to watch the YAML file for changes and preview in Chrome (needs refresh)
3. Execute ```npm run convert``` to convert all radars to their CSV formats
4. Commit and push to mke changes visible for the rest of the world

## Background information

For visualizing the technology radars we use the [ThoughtWorks radar visualization tool](https://www.thoughtworks.com/radar/how-to-byor).
This online tool utilizes either a link to a Google Sheet or to a CSV file. We don't want to manage our radar in a Google Sheet because we would like to utilize versioning and access through Git. We also don't want to edit CSV files directly, because they are hard to read and maintain. That is the reason we mange the technology radar in the YAML format.

If you initially created a technology radar in a Google Sheet, export it to a CSV file, and convert it to YAML using http://convertcsv.com/csv-to-yaml.htm. The resulting YAML can be added to the Git repo. To access the YAML files in their raw format we access them at the following end-point: https://raw.githack.com/xprtz/radar/master/radar.yaml.

Because githack.com does caching on the files in GitHub for raw access, it can take some time before updates to GitHub documents are reflected in the request over the above end-point.

The YAML file must be converted to CSV format for use by the ThoughtWorks radar visualization tool. We can convert YAML to CSV using the online tool https://jsonformatter.org/yaml-to-csv. This tool can convert a YAML file to CSV by specifying the url to the YAML file as follows: ```https://jsonformatter.org/yaml-to-csv/?url=file.yaml```.

For now we do the conversion manually and save the result to a CSV file next to the YAML file. In the future we will build an online converter tool that will have the url to the YAML file as parameter and result in the converted CSV.

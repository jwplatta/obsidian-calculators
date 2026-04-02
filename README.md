# Obsidian Calculators

## Description

- This is an Obsidian plugint that allows a user to run some sort of calculatio. For starters we will implement a simple compound interest calculator and then extend from there.
- The user should be able to use a search modal (that's provided by the Obsidian API) to select a calculator (right now there will only be one to select, compound interest). The user selects the calculator and the plugin launches a new view in the center/main leaf of the Obsidian app that contains the calculator
- The calculator view should contain fields for inputing whatever parameters are needed for the calculator. There can be requried and not required parameters. For non-required parameters, just set sensible defaults. Some of these parameters should just use the toggles is they are boolean, sliders if they are range, sliders should also have the ability to input values manually.
- As values are input into the fields, below the parameters should be a chart (probably a line graph, but it depends on the calculator) that adjusts as the user changes the values
- There should be a save button on the calculator view that allows the user to save the a calculator once the user input the desired values. The user will also have to provide a title for the save calculator. The parameters values of calculator should get saved to a json file inside hte obsidian vault. Where these saved calculator json go should be defined in the settings view. The default folder should just be /calculators which should get created by the plugin on install.
- A user can reload a calculator by use the load-calculator command which launches a fuzzy search modal. The user selects the saved calculator and the plugin should launch the calculator view with the saved parameter values loaded. If the user changes the values and tries to save it, we should launch a confirmation modal to make sure the user is actually intending to save over hte calculator
- There should also be a plugin command view-calculators to launch a table view of all the saved calculators. The table view should display the name of the saved calculator, the type of calculator, and the save / edit date. The name of the calculator in the table should also function as a link that when clicked opens up the saved calculator with the saved paratmeter values loaded up.
- The settings view for the plugin should have one parameter, the directory where teh saved calculators json goes

## Development

- You can use the local_notes vault on this machine located at ~/.obsidian/local_notes to development against
- You can launch the Obsidian app with this vault in order to test that it's working
- When you want to deploy the plugin to the vault to tests it you will need to do the following:
```
#!/bin/bash

npm install
npm run build

cp ~/repos/obsidian-calculators/main.js '~/.obsidian/local_notes/.obsidian/plugins/obsidian-calculators'
cp ~/repos/obsidian-calculators/manifest.json '~/.obsidian/local_notes/.obsidian/plugins/obsidian-calculators'
cp ~/repos/obsidian-calculators/styles.css '~/.obsidian/local_notes/.obsidian/plugins/obsidian-calculators'

mv ./main.js ./dist
cp ./styles.css ./dist
cp ./manifest.json ./dist
```
- You will also need to make sure the plugin folder exists

## Deployment and Versioning

- We want to make sure that we semantic version this plugin
- We want to create a github action that will generate releases that contain the main.js, manifest.json, and styles.css files. However, I'm not sure how we can get it to automate bumping the correct version and then triggering the release. If this is too difficult to figure, then let's just create a github action that takes the semantic version as an argument from the user when it's triggered. Let me know if there's like an obvious easy way to handle what I'm describing

## Components
- Fuzzy search modal
- Settings
- Calculator View
- Command for launching the search modal
- Table view of saved calculators
- command for launching the table view

## Requirements

- Use React components to implement the view
- Calculations should be saved as json in a directory in the vault specified in teh settings

## Dependencies

- We need to select a very simple and easy charting library for typescript that will work with Obsidian (which is an electron app)
- React
- Obsidian API
- Typescript
- Use Jest for some basic unit tests

## References

- Refer to the obsidian_semantic_search plugin for examples of how to do things
- Refer to the uber_bot plugin as another example of how to do things
// Basic test for initial screen

module.exports = {
  "init screen": browser => {
    browser
      .init()
      .waitForElementVisible("#app")
      .assert.elementPresent("h1")
      .assert.containsText("h1", "Find Your Addresses!")
      .assert.elementPresent(".el-steps")
      .assert.elementCount("input[type=file]", 1)
      .assert.elementCount("button", 1)
      .assert.elementPresent(".instruction")
      .end();
  },

  "full flow checkup": browser => {
    browser
      .init()
      .setValue(
        "input[type=file]",
        require("path").resolve(__dirname + "/dummy-files/input.csv")
      )
      .click(".vue-csv-uploader-part-one button")
      .assert.elementPresent("table")
      .assert.elementCount("button", 2)
      .pause(100)
      .click("select[name='csv_uploader_map_2'] option:nth-child(3)")
      .pause(100)
      .click(".vue-csv-uploader-part-two button")
      .pause(300)
      .assert.elementPresent(".el-progress-circle")
      .pause(1500)
      .assert.elementPresent(".vue2leaflet-map")
      .assert.elementCount(".el-table tr", 8)
      .assert.elementCount(".el-badge", 4)
      .assert.elementCount(".my-custom-pin", 7)
      .assert.elementPresent("button.floating")
      .end();
  }
};

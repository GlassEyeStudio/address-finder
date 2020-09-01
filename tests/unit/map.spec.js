import { shallowMount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
const localVue = createLocalVue();
import ElementUI from "element-ui";
import Map from "@/views/Map";

localVue.use(Vuex);
localVue.use(ElementUI);

describe("CsvImporter.vue", () => {
  let actions;
  let store;
  beforeEach(() => {
    actions = {
      actionClick: jest.fn(),
      actionInput: jest.fn()
    };
    store = new Vuex.Store({
      actions,
      state: {
        processStep: 3,
        markers: [
          {
            coordinates: { lat: 40.089909, lng: -82.612731 },
            name:
              "Church Street, Alexandria, Saint Albans Township, Licking County, Ohio, 43001, United States of America",
            category: "exampleCategory"
          },
          {
            coordinates: { lat: 29.609995546467804, lng: -95.54889906195707 },
            name:
              "303, Swords Bend, Stafford, Fort Bend County, Texas, 77477, United States of America",
            category: "bc"
          }
        ]
      }
    });
  });

  it("Check if proper elems renders depends on state", () => {
    const wrapper = shallowMount(Map, {
      store,
      localVue
    });

    /* parse markers from the store */
    wrapper.vm.getCategories();
    wrapper.vm.filteredMarkersList();

    /* after layout reload check if it's rendered correctly */
    localVue.nextTick(() => {
      expect(wrapper.findAll("el-badge-stub").length).toBe(2);
      expect(wrapper.find("el-badge-stub el-button-stub").text()).toMatch(
        "exampleCategory"
      );
      expect(wrapper.find("el-table-stub").exists()).toBe(true);
      expect(wrapper.find("el-table-column-stub").exists()).toBe(true);
      expect(wrapper.find("el-table-column-stub").attributes("label")).toMatch(
        "Adresses (2)"
      );
      expect(wrapper.find("l-map-stub").exists()).toBe(true);
      expect(wrapper.find("l-tile-layer-stub").exists()).toBe(true);
      expect(wrapper.findAll("l-marker-stub").length).toBe(2);
      expect(wrapper.findAll("l-icon-default-stub").length).toBe(2);
      expect(wrapper.findAll("l-popup-stub").length).toBe(2);
      expect(wrapper.find("l-popup-stub").text()).toMatch(
        "Church Street, Alexandria, Saint Albans Township, Licking County, Ohio, 43001, United States of America"
      );
    });
  });
});

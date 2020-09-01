import CsvImporter from "@/views/CsvImporter";
import { shallowMount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
const localVue = createLocalVue();
import ElementUI from "element-ui";

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
        processStep: 1
      }
    });
  });

  it("Check if proper elems renders depends on state", () => {
    const wrapper = shallowMount(CsvImporter, {
      store,
      localVue
    });

    expect(wrapper.find("vue-csv-import-stub").exists()).toBe(true);
    expect(wrapper.find(".instruction").exists()).toBe(true);
    expect(wrapper.find("el-progress-stub").exists()).toBe(false);

    store.state.processStep = 2;
    localVue.nextTick(() => {
      expect(wrapper.find("vue-csv-import-stub").exists()).toBe(false);
      expect(wrapper.find(".instruction").exists()).toBe(false);
      expect(wrapper.find("el-progress-stub").exists()).toBe(true);
    });
  });
});

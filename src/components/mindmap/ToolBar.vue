<template>
  <div 
    class="toolbar"
  >
    <svg 
      class="tool" 
      viewBox="0 0 16 16" 
      title="Left"
      @click="activateLeftNode()"
      v-if="canActivateLeftNode()"
    >
      <path fill-rule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm11.5 5.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z"/>
    </svg>   

    <svg 
      class="tool" 
      viewBox="0 0 16 16" 
      title="Up"
      @click="activateUpNode()"
      v-if="canActivateUpNode()"
    >
      <path fill-rule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm8.5 9.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707V11.5z"/>
    </svg>  

    <svg 
      class="tool" 
      viewBox="0 0 16 16" 
      title="Down"
      @click="activateDownNode()"
      v-if="canActivateDownNode()"
    >
      <path fill-rule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm8.5 2.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V4.5z"/>
    </svg>  

    <svg 
      class="tool" 
      viewBox="0 0 16 16" 
      title="Right"
      @click="activateRightNode()"
      v-if="canActivateRightNode()"
    >
      <path fill-rule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"/>
    </svg>  

    <svg 
      class="tool" 
      viewBox="0 0 16 16" 
      title="Save"
      @click="onSaveBtnClick"     
      v-if="getCanSave()" 
    >
      <path d="M2 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H9.5a1 1 0 0 0-1 1v7.293l2.646-2.647a.5.5 0 0 1 .708.708l-3.5 3.5a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L7.5 9.293V2a2 2 0 0 1 2-2H14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h2.5a.5.5 0 0 1 0 1H2z"/>
    </svg>    
  </div>
</template>

<script>
export default {
  name: "ToolBar",
  inject: {
    getCanSave: {
      from: 'getCanSave',
      default: false
    },
    setCanSave: {
      from: 'setCanSave',
      default: () => {}
    },
    canActivateLeftNode: {
      from: 'canActivateLeftNode',
      default: () => {}
    },
    canActivateRightNode: {
      from: 'canActivateRightNode',
      default: () => {}
    },
    canActivateUpNode: {
      from: 'canActivateUpNode',
      default: () => {}
    },
    canActivateDownNode: {
      from: 'canActivateDownNode',
      default: () => {}
    },
    activateLeftNode: {
      from: 'activateLeftNode',
      default: () => {}
    },
    activateRightNode: {
      from: 'activateRightNode',
      default: () => {}
    },
    activateUpNode: {
      from: 'activateUpNode',
      default: () => {}
    },
    activateDownNode: {
      from: 'activateDownNode',
      default: () => {}
    },
    saveToLocalStorage: {
      from: 'saveToLocalStorage',
      default: () => {}
    }
  },
  methods: {
    onSaveBtnClick() {
      this.saveToLocalStorage();
      this.setCanSave(false);
    }
  }
}
</script>

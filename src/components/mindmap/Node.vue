<template>
  <li>
    <article 
      ref="article"
      :class="{collapsed: node.collapsed, editable: node.editable, active}"
      :tabindex="tabIndex"
      :contenteditable="node.editable"    
      @input="onNodeInput"
      @click.stop="onNodeClicked"      
      @keydown.space="onNodeSpacePressed"
      @keydown.tab.prevent="onNodeTabPressed"
      @keydown.enter.prevent="onNodeEnterPressed"
      @keydown.delete="onNodeDelPressed"      
      @keydown.left="onNodeLeftPressed"
      @keydown.right="onNodeRightPressed"
      @keydown.up="onNodeUpPressed"   
      @keydown.down="onNodeDownPressed"    
      @keydown.68.exact="onNodeDPressed"
      @keydown.shift.68="onNodeShiftDPressed"            
    />
    
    <ul v-if="!node.collapsed && node.children && node.children.length">
      <node 
        v-for="(child, index) in node.children"
        :key="child.id"
        :node="child"
        :tabIndex="index"
      />
    </ul>
  </li>  
</template>

<script>
export default {
  name: "Node",
  inject: {
    parent: {
      from: 'parent',
      default: () => {}
    },
    setNodeLabel: {
      from: 'setNodeLabel',
      default: () => {}
    },
    setNodeEditable: {
      from: 'setNodeEditable',
      default: () => {}
    },
    setNodeCollapsed: {
      from: 'setNodeCollapsed',
      default: () => {}
    },
    setActiveNode: {
      from: 'setActiveNode',
      default: () => {}
    },
    createChildNode: {
      from: 'createChildNode',
      default: () => {}
    },
    removeNode: {
      from: 'removeNode',
      default: () => {}
    },
    moveToLeftNode: {
      from: 'moveToLeftNode',
      default: () => {}
    },
    moveToRightNode: {
      from: 'moveToRightNode',
      default: () => {}
    },
    moveToUpNode: {
      from: 'moveToUpNode',
      default: () => {}
    },
    moveToDownNode: {
      from: 'moveToDownNode',
      default: () => {}
    },
    setChildNodesCollapsed: {
      from: 'setChildNodesCollapsed',
      default: () => {}
    }
  },
  data: () => ({
    numClicks: 0,
    childrenCollapsed: false
  }),  
  props: {
    node: Object,
    tabIndex: Number
  },
  computed: {
    label() {
      return this.node.label;
    },
    active() {
      return this.node.active;
    }
  },
  watch: {
    label(newLabel) {
      this.updateArticleContent(newLabel);
    },
    active(newActive) {
      this.updateArticleFocus(newActive);
    }
  },
  mounted: function() {   
    this.updateArticleContent(this.label);
    this.updateArticleFocus(this.active);
  },
  methods: {
    onNodeInput: function() {
      this.setNodeLabel(
        this.node, 
        this.$refs.article.textContent.replace(/(<([^>]+)>)/gi, "")
      );
    },
    onNodeClicked: function() {
      this.numClicks++;

      if(!this.node.active) {
        this.setActiveNode(this.node);
      } else {
        this.setNodeCollapsed(this.node, !this.node.collapsed);
      }

      setTimeout(() => {
        if(this.numClicks > 1 && !this.node.editable) {
          this.setNodeEditable(this.node, true);
        }
        this.numClicks = 0;
      }, 300);
    },
    onNodeSpacePressed: function(event) {
      if(!this.node.editable) {
        event.preventDefault();

        this.setNodeEditable(this.node, true);        
      }
    }, 
    onNodeTabPressed: function() {
      this.createChildNode(this.node);
    },
    onNodeEnterPressed: function() {
      if(!this.node.editable) {
        this.createChildNode(this.parent(this.node));       
      } else {
        this.setNodeEditable(this.node, false);
      }
    },
    onNodeDelPressed: function() {
      if(!this.node.editable) {
        this.removeNode(this.node);        
      }
    },
    onNodeLeftPressed: function() {
      if(!this.node.editable) {
        this.moveToLeftNode(this.node);
      }
    },
    onNodeRightPressed: function() {
      if(!this.node.editable) {        
        this.moveToRightNode(this.node);
      }      
    },
    onNodeUpPressed: function() {
      this.moveToUpNode(this.node);          
    },
    onNodeDownPressed: function() {
      this.moveToDownNode(this.node);          
    },
    onNodeDPressed: function() {
      if(!this.node.editable) {
        this.setNodeCollapsed(this.node, !this.node.collapsed);
      }
    },
    onNodeShiftDPressed: function() {
      if(!this.node.editable) {
        this.childrenCollapsed = !this.childrenCollapsed;

        this.setChildNodesCollapsed(this.node, this.childrenCollapsed);        
      }
    },    
    updateArticleContent(content) {
      this.$refs.article.textContent = content;
    },
    updateArticleFocus(active) {
      if(active) {
        this.$refs.article.focus();
      } else {
        this.$refs.article.blur();
      }
    }
  }
}
</script>

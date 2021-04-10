<template>
  <div class="container">
    <tool-bar />
    <ul class="mindmap" @click="disposeActiveNode">
      <node 
        v-for="(node, index) in root.children"      
        :key="node.id"
        :node="node"
        :tabIndex="index"
      />
    </ul>  
  </div>
</template>

<script>
import Node from './Node.vue';
import ToolBar from './ToolBar.vue';

export default {
  name: "MindMap",
  data: () => ({    
    root: {
      id: null,
      children: []
    },
    canSave: false,
    activeNode: null,
    parents: {}
  }),
  created() {
    this.loadFromLocalStorage();
  },
  methods: {
    _getInitialNode() {
      return {
        id: Date.now(),
        label: 'Press Space or double click to edit',
        active: false,
        editable: false,
        collapsed: false,
        children: []      
      };
    },
    _clearState() {
      this.setActiveNode(null);
      this.root.children = [];
      this.parents = {};
      this.setCanSave(false);    
    },
    _setParents(children, parent) {
      children.forEach(child => {
        this._addParent(child, parent);

        if(child.children.length > 0) {
          this._setParents(child.children, child);
        }
      });
    },
    _unsetNodeActive(children) {
      children.forEach(child => {
        child.active = false;
        
        if(child.children.length > 0) {
          this._unsetNodeActive(child.children);
        }
      });
    },
    _addNode(children, newNode) {
      children.push(newNode);
      this.setCanSave(true);
    },
    _addParent(node, parent) {
      this.parents[node.id] = parent;
    },
    _deleteNode(children, node) {
      const index = children.findIndex(elem => elem.id === node.id);
      children.splice(index, 1);
      setCanSave(true);
    },
    _deleteParent(node) {
      delete this.parents[node.id];
    },
    getRoot() {
      return this.root;
    },
    getActiveNode() {
      return this.activeNode;
    },
    getCanSave() {
      return this.canSave;
    },
    setCanSave(canSave) {
      this.canSave = canSave;
    },
    disposeActiveNode() {
      this.setActiveNode(null);
    },
    parent(node) {
      if(node.id) {
        return this.parents[node.id];
      }
      return null;
    },
    setNodeLabel(node, label) {
      node.label = label;
      this.setCanSave(true);
    },
    setNodeActive(node, active) {
      node.active = active;
      this.setCanSave(true);
    },
    setNodeEditable(node, editable) {
      node.editable = editable;
      this.setCanSave(true);
    },
    setNodeCollapsed(node, collapsed) {
      if(!collapsed || node.children.length > 0) {
        node.collapsed = collapsed;
        this.setCanSave(true);
      }
    },
    canMoveToLeftNode(node) {
      return this.parent(node).id;
    },
    canMoveToRightNode(node) {
      return !node.collapsed && node.children.length > 0;
    },
    canMoveToUpNode(node) {
      return this.parent(node).children.indexOf(node) > 0;
    },
    canMoveToDownNode(node) {
      const index = this.parent(node).children.indexOf(node);

      return index >= 0 && index < this.parent(node).children.length - 1;
    },    
    canActivateLeftNode() {
      return this.activeNode && this.canMoveToLeftNode(this.activeNode);
    },
    canActivateRightNode() {
      return this.activeNode && this.canMoveToRightNode(this.activeNode);
    },
    canActivateUpNode() {
      return this.activeNode && this.canMoveToUpNode(this.activeNode);
    },
    canActivateDownNode() {
      return this.activeNode && this.canMoveToDownNode(this.activeNode);
    },    
    middleChildNode(node) {
      if(node.children.length > 0) {
        const index = Math.floor((node.children.length - 1) / 2);

        return node.children[index];
      }
      return null;
    },
    upNode(node) {
      const index = this.parent(node).children.indexOf(node);

      if(index > 0) {
        return this.parent(node).children[index-1];
      }

      return null;
    },
    downNode(node) {
      const index = this.parent(node).children.indexOf(node);

      if(index >= 0 && index < this.parent(node).children.length - 1) {
        return this.parent(node).children[index + 1];
      }

      return null;
    },
    setActiveNode(node) {
      if(!node || !this.activeNode || node.id !== this.activeNode.id) {
        if(this.activeNode) {
          this.setNodeActive(this.activeNode, false);
          this.setNodeEditable(this.activeNode, false);
        }

        if(node) {
          this.setNodeActive(node, true);
        }

        this.activeNode = node;
        this.setCanSave(true);
      }
    },
    createChildNode(parent) {
      const newNode = {
        id: Date.now(),
        label: '',
        active: false,
        editable: true,
        collapsed: false,
        children: []          
      };

      this._addNode(parent.children, newNode);
      this._addParent(newNode, parent);
      this.setActiveNode(newNode);

      if(parent.id) {
        this.setNodeCollapsed(parent, false);
      }
    },
    removeNode(node) {
      const parent = this.parent(node);

      if(!parent.id && parent.children.length < 2) return;
      
      const index = parent.children.indexOf(node);
      
      this._deleteNode(parent.children, node);
      this._deleteParent(node);
      
      let focusIndex = parent.children.length - 1;
      
      if(parent.children.length > index) {
        focusIndex = index;
      }

      if(focusIndex >= 0) {
        const focusNode = parent.children[focusIndex];  
        this.setActiveNode(focusNode);        
      } else if(parent.id) {
        this.setActiveNode(parent);
      } 
    },
    setChildNodesCollapsed(node, collapsed) {
      this.setNodeCollapsed(node, false);

      node.children.forEach(child => {
        if(!collapsed || child.children.length > 0) {
          this.setNodeCollapsed(child, collapsed);       
        }
      });
    },
    moveToLeftNode(node) {
      if(this.canMoveToLeftNode(node)) {
        this.setActiveNode(this.parent(node));
      }
    },
    moveToRightNode(node) {
      if(this.canMoveToRightNode(node)) {
        const childNode = this.middleChildNode(node);

        if(childNode) {
          this.setActiveNode(childNode);
        }
      }
    },
    moveToUpNode(node) {
      if(this.canMoveToUpNode(node)) {
        const upNode = this.upNode(node);

        if(upNode) {
          this.setActiveNode(upNode);
        }
      }
    },
    moveToDownNode(node) {
      if(this.canMoveToDownNode(node)) {
        const downNode = this.downNode(node);

        if(downNode) {
          this.setActiveNode(downNode);
        }
      }
    },
    activateLeftNode() {
      if(this.activeNode && this.canActivateLeftNode()) {
        this.moveToLeftNode(this.activeNode);
      }
    },
    activateRightNode() {
      if(this.activeNode && this.canActivateRightNode()) {
        this.moveToRightNode(this.activeNode);
      }
    },
    activateUpNode() {
      if(this.activeNode && this.canActivateUpNode()) {
        this.moveToUpNode(this.activeNode);
      }
    },
    activateDownNode() {
      if(this.activeNode && this.canActivateDownNode()) {
        this.moveToDownNode(this.activeNode);
      }
    },
    saveToLocalStorage() {
      localStorage.setItem('mindmap', JSON.stringify(this.root.children));
    },
    setInitialState() {
      this.setActiveNode(null);

      const initialNode = this._getInitialNode();

      this.root.children = [
        initialNode
      ];      
      this.parents = {
        [initialNode.id]: this.root
      };

      this.setCanSave(false);    
    },
    setState(children) {
      this.setActiveNode(null);
      this._setParents(children, this.root);  
      this._unsetNodeActive(children);
      this.setCanSave(false);  
      this.root.children = children;  
    },    
    loadFromLocalStorage() {
      this._clearState();

      let data = null;

      try {
        data = JSON.parse(localStorage.getItem('mindmap'));
      } catch(error) {
        console.error(error);
      }

      if(data && typeof data === 'object') {
        this.setState(data);
      } else {
        this.setInitialState();
      }
    }
  },    
  provide: function() {
    return {
      getRoot: this.getRoot,
      getActiveNode: this.getActiveNode,
      getCanSave: this.getCanSave,
      setCanSave: this.setCanSave,
      disposeActiveNode: this.disposeActiveNode,
      parent: this.parent,
      setNodeLabel: this.setNodeLabel,
      setNodeActive: this.setNodeActive,
      setNodeEditable: this.setNodeEditable,
      setNodeCollapsed: this.setNodeCollapsed,
      canMoveToLeftNode: this.canMoveToLeftNode,
      canMoveToRightNode: this.canMoveToRightNode,
      canMoveToUpNode: this.canMoveToUpNode,
      canMoveToDownNode: this.canMoveToDownNode, 
      canActivateLeftNode: this.canActivateLeftNode,
      canActivateRightNode: this.canActivateRightNode,
      canActivateUpNode: this.canActivateUpNode,
      canActivateDownNode: this.canActivateDownNode,           
      middleChildNode: this.middleChildNode,
      upNode: this.upNode,
      downNode: this.downNode,
      setActiveNode: this.setActiveNode,
      createChildNode: this.createChildNode,
      removeNode: this.removeNode,
      setChildNodesCollapsed: this.setChildNodesCollapsed,
      moveToLeftNode: this.moveToLeftNode,
      moveToRightNode: this.moveToRightNode,
      moveToUpNode: this.moveToUpNode,
      moveToDownNode: this.moveToDownNode,
      activateLeftNode: this.activateLeftNode,
      activateRightNode: this.activateRightNode,
      activateUpNode: this.activateUpNode,
      activateDownNode: this.activateDownNode,
      saveToLocalStorage: this.saveToLocalStorage,
      setInitialState: this.setInitialState,
      setState: this.setState,
      loadFromLocalStorage: this.loadFromLocalStorage            
    };
  },
  components: {
    ToolBar, Node
  }
}
</script>

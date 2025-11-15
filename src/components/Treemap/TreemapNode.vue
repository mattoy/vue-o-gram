<script setup lang="ts" generic="Content extends ContentType">
	import { StyleValue, computed } from 'vue';
	import { Node, InternalNode, LeafNode, Direction } from './models';
	import { ContentType } from './interfaces/ContentType';

	const props = defineProps<{ node: Node<Content> }>()

	defineSlots<{ default: (props: { content: Content }) => any }>();

	const nodeStyle = computed<StyleValue>(() => {
		const flexingNode = { flexGrow: props.node.weight }
		
		if(props.node instanceof InternalNode) {
			const direction = props.node.direction === Direction.column ? "column" : "row"
			return { ...flexingNode, flexDirection: direction }
		} else {
			return flexingNode
		}
	})
</script>

<template>
	<span v-if="(node instanceof LeafNode)"
		  :style="nodeStyle">
		<slot :content="node.content"></slot>
	</span>
	<div v-if="(node instanceof InternalNode)" 
		 :style="nodeStyle" 
		 :class="node.direction">
		<TreemapNode
			v-for="(child, index) in node.children"
					:key="index"
					:node="child" 
					v-slot="slotProps: { content: Content }">
			<slot :content="slotProps.content"></slot>
		</TreemapNode>	
	</div>
</template>

<style scoped>
div {
	width: 100%;
	height: 100%;
	display: flex;
	min-width: 0;
	min-height: 0;
	flex-basis: 1px;
	gap: 6px; /* TODO confirm if areas are still correctly distributed */
}

span {
	min-width: 0;
	min-height: 0;
	overflow: hidden;
}
</style>
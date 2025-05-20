<template>
	<div id="treemap" 
		 ref="treemapReference"> 
		<TreemapNode v-if="templateRectangle" 
					:node="getTreemap(items, templateRectangle)" 
					 v-slot="slotProps: { content: Content }">
			<slot :content="slotProps.content">
				<div class="defaultStyle">
					<strong>{{ slotProps.content.weight }}</strong>
				</div>
			</slot>
		</TreemapNode>
	</div>
</template>

<script setup lang="ts" generic="Content extends ContentType">
import { ContentType } from './interfaces/ContentType'
import { NestedArray } from './interfaces/NestedArray'
import { onMounted, ref, useTemplateRef } from "vue"
import { Rectangle, Node } from './models'
import TreemapNode from './TreemapNode.vue'
import { preProcess, squarify } from './models/Squarified'

defineProps<{ items: NestedArray<Content>[] }>()

const treemapReference = useTemplateRef('treemapReference')
const templateRectangle = ref<Rectangle | undefined>(undefined)

onMounted(() => {
	templateRectangle.value = Rectangle.from(treemapReference.value!.getBoundingClientRect())
})

function getTreemap(rawItems: NestedArray<Content>[], boundingRectangle: Rectangle): Node<Content> {
	const preProcessedItems = preProcess(rawItems)
	const result = squarify(preProcessedItems, null, boundingRectangle)				
	return result
}

</script>

<style scoped>
	#treemap {
		width: 100%;
		height: 100%;
	}

	div.defaultStyle {
		box-sizing: border-box;
		width: 100%;
		height: 100%;
		padding: 8px;

		background-color: silver;
		border-radius: 6px;
	}
</style>
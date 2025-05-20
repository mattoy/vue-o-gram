<script setup lang="ts">
import Treemap from '../src/components/Treemap'
</script>

<template>
	<Treemap :items="[
		{
			'label': 'Three',
			'weight': 3,
			'color': 'lightcoral'
		},
		{
			'label': 'Three',
			'weight': 3,
			'color': 'lightskyblue'
		},
		{
			'label': 'One',
			'weight': 1,
			'color': 'darkseagreen'
		},
		{
			'label': 'Five',
			'weight': 5,
			'color': 'khaki'
		},
		{
			'label': 'One',
			'weight': 1,
			'color': 'thistle'
		},
		{
			'label': 'Two',
			'weight': 2,
			'color': 'lightsalmon'
		}
		]"
		v-slot="{ content }"
	>
		<div class="item" :style="{ backgroundColor:content.color }">
			<strong>{{ content.label }}</strong>
		</div>
	</Treemap>
	<br>
	<Treemap
		:items="[
			{
				'label': 'Carbohydrates',
				'weight': 13.7,
				'color': 'palegreen'
			},
			[{
				'label': 'Saturated Fat',
				'weight': 6.1,
				'color': 'palegoldenrod'
			},
			{
				'label': 'Polyunsaturated Fat',
				'weight': 47.2,
				'color': 'palegoldenrod'
			},
			{
				'label': 'Monounsaturated Fat',
				'weight': 8.9,
				'color': 'palegoldenrod'
			}],
			{
				'label': 'Protein',
				'weight': 15.2,
				'color': 'paleturquoise'
			},
			{
				'label': 'Fiber',
				'weight': 2,
				'color': 'lightpink'
			}]"
		v-slot="{ content }">
		<div class="item" :style="{ backgroundColor:content.color }">
			<span>
				<strong>{{ content.label }}</strong>
				{{ content.weight }}g
			</span>
		</div>
	</Treemap>
	<br>
</template>

<style>
#app {
  width: 800px;
  height: 600px;
}
html, body {
  height: 100%;
}

div.item {
	font-family: 'Arial', sans-serif;
	font-size: 14pt;
	box-sizing: border-box;
	width: 100%;
	height: 100%;
	padding: 14px;

	background-color: silver;
	border-radius: 6px;
}
</style>

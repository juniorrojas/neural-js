var NeuralNet = require("./NeuralNet");
var DataCanvas = require("./DataCanvas");
var Vector2 = require("./Vector2");

var cLightBlue = d3.rgb(186, 224, 251);
var cLightRed = d3.rgb(252, 163, 163);

var cRed = d3.rgb(226, 86, 86);
var cBlue = d3.rgb(135, 173, 236);

colorBlend = function(a, b, t) {
	return d3.rgb(
		a.r * t + b.r * (1 - t),
		a.g * t + b.g * (1 - t),
		a.b * t + b.b * (1 - t)
	);
}

roundDigits = function(n, decimalDigits) {
	var factor = 1;
	for (var i = 0; i < decimalDigits; i++) factor*= 10;
	return Math.round(n * factor) / factor;
}

var svg = require("./svg");

function init() {
	var svgContainer = svg.createElement("svg");
	svgContainer.style.height = "400px";
	document.body.appendChild(svgContainer);

	var neuralNet = new NeuralNet();
	svgContainer.appendChild(neuralNet.svgElement);

	neuralNet.addLayer(2);
	neuralNet.addFullyConnectedLayer(5);
	neuralNet.addFullyConnectedLayer(5);
	neuralNet.addFullyConnectedLayer(2);
	neuralNet.addFullyConnectedLayer(1);
	
	neuralNet.redraw();
	
	var dataCanvas = new DataCanvas();
	dataCanvas.addDataPoint(0.2, 0.5, 0);
	dataCanvas.addDataPoint(0.1, 0.3, 0);
	dataCanvas.addDataPoint(0.4, 0.7, 1);
	dataCanvas.redraw();
	document.body.appendChild(dataCanvas.domElement);

	return;

	trainingSet = [
		{x: [0.08, 0.24], y: 1},
		{x: [0.2, 0.27], y: 1},
		{x: [0.05, 0.30], y: 1},
		{x: [0.1, 0.1], y: 1},

		{x: [0.4, 0.4], y: 0},
		{x: [0.6, 0.4], y: 0},
		{x: [0.65, 0.7], y: 0},
		{x: [0.7, 0.3], y: 0},
		{x: [0.35, 0.65], y: 0},

		{x: [0.3, 0.5], y: 0},
		{x: [0.7, 0.5], y: 0},
		{x: [0.75, 0.55], y: 0},
		{x: [0.7, 0.6], y: 0},
		{x: [0.65, 0.34], y: 0},
		{x: [0.8, 0.65], y: 0},
		{x: [0.5, 0.7], y: 0},
		{x: [0.5, 0.66], y: 0},
		{x: [0.56, 0.66], y: 0},
		{x: [0.46, 0.36], y: 0},
		{x: [0.46, 0.26], y: 0},
		{x: [0.36, 0.26], y: 0},
		{x: [0.26, 0.36], y: 0},
		{x: [0.56, 0.28], y: 0},
		{x: [0.33, 0.54], y: 0},
		{x: [0.23, 0.52], y: 0},

		{x: [0.26, 0.16], y: 1},
		{x: [0.06, 0.46], y: 1},
		{x: [0.13, 0.66], y: 1},

		{x: [0.2, 0.8], y: 1},

		{x: [0.5, 0.5], y: 1},
		{x: [0.45, 0.5], y: 1},
		{x: [0.5, 0.45], y: 1},
		{x: [0.45, 0.45], y: 1},
		{x: [0.55, 0.55], y: 1},
		{x: [0.5, 0.55], y: 1},

		{x: [0.2, 0.8], y: 1},

		{x: [0.5, 0.2], y: 1},
		{x: [0.4, 0.1], y: 1},
		{x: [0.6, 0.1], y: 1},
		{x: [0.75, 0.15], y: 1},
		{x: [0.75, 0.15], y: 1},

		{x: [0.88, 0.22], y: 1},
		{x: [0.9, 0.35], y: 1},
		{x: [0.90, 0.49], y: 1},
		{x: [0.88, 0.62], y: 1},

		{x: [0.9, 0.9], y: 1},
		{x: [0.9, 0.8], y: 1},
		{x: [0.75, 0.85], y: 1},
		{x: [0.55, 0.92], y: 1},
		{x: [0.6, 0.95], y: 1},

		{x: [0.06, 0.57], y: 1},
		{x: [0.09, 0.8], y: 1},
		{x: [0.4, 0.9], y: 1},
	];

	svgWidth = 340;
	svgHeight = 250;
	canvasWidth = 250;
	canvasHeight = 250;
	canvasWidthMini = 50;
	canvasHeightMini = 50;
	neuronRadius = 12;
	maxSpikeRadius = 7;
	preactivationTop = 10;
	minOutputPaint = 0.5 - 0.5;
	maxOutputPaint = 0.5 + 0.5;

	fWidth = canvasWidth / canvasWidthMini;
	fHeight = canvasHeight / canvasHeightMini;

	learningRate = 0.3;
	regularization = 0.00001;

	neuralNet = new NeuralNet();

	var neuronsPerLayer = [2, 5, 5, 2, 1];

	var dy = 50;
	var x = 20;
	var dx = 70;

	var layers = [];

	for (var i = 0; i < neuronsPerLayer.length; i++) {
		layers.push([]);
		for (var j = 0; j < neuronsPerLayer[i]; j++) {
			var y = svgHeight / 2 + (j - (neuronsPerLayer[i] - 1) / 2) * dy;
			var pos = new Vector2(x, y);

			var neuron = neuralNet.addNeuron(pos, 0);

			layers[i].push(neuron);

			if (i == 0) neuralNet.input.push(neuron);
			else
			if (i == neuronsPerLayer.length - 1) neuralNet.output.push(neuron);
		}
		x += dx;
	}

	for (var i = 0; i < layers.length; i++) {
		var layer = layers[i];
		for (var j = 0; j < layer.length; j++) {
			var n0 = layer[j];
			if (i < layers.length - 1) {
				var nextLayer = layers[i + 1];
				for (var k = 0; k < nextLayer.length; k++) {
					var nf = nextLayer[k];
					var weight = 2 + Math.random() * 4;
					if (Math.random() <= 0.5) weight *= -1;
					neuralNet.addLink(n0, nf, weight);
				}
			}
		}
	}

	var initialParameters = {
		"neurons":[
			{"bias": 0}, {"bias": 0}, {"bias": 0.14926214704417798}, {"bias": -1.5760565067172967},
			{"bias": -0.0070790515773630994}, {"bias": -0.9610370821643252}, {"bias": -0.4631415695352903},
			{"bias": -0.4930638653997511}, {"bias": -1.2292654208180753}, {"bias": 1.233787276253548},
			{"bias": -2.054973071108484}, {"bias": -1.3979682183549529}, {"bias": 0.6288132165377796},
			{"bias": -0.9965512697250088}, {"bias": 3.500734405313219}],
		"links":[
			{"weight": 2.2559318523672673}, {"weight": 3.7705902078344162}, {"weight": -5.673868837964195},
			{"weight": -2.552116396138559}, {"weight": -4.765897189158554}, {"weight": 2.522847383501193},
			{"weight": -2.9902303588384505}, {"weight": 2.749623598598969}, {"weight": -2.0657459601688077},
			{"weight": 2.311040191441733}, {"weight": -2.8083933750840506}, {"weight": 2.368208438212055},
			{"weight": 2.792010178964303}, {"weight": 2.1204797088106764}, {"weight": 3.0855603411983634},
			{"weight": -2.1619760012233913}, {"weight": 2.7735676578848043}, {"weight": -4.795321974592097},
			{"weight": -3.1618858651724424}, {"weight": 2.642537468325151}, {"weight": 5.111269168104936},
			{"weight": 1.8060793114773712}, {"weight": 1.2874475479043777}, {"weight": 3.715659708889894},
			{"weight": -5.479057778095251}, {"weight": 4.279970838297447}, {"weight": -3.8573191202934085},
			{"weight": -4.346636276004062}, {"weight": 1.8026421918582567}, {"weight": 3.9687935202147346},
			{"weight": -3.5216391228147197}, {"weight": 4.599458665307638}, {"weight": -4.752572287153145},
			{"weight": -3.810827524569661}, {"weight": 3.0650028924296953}, {"weight": -4.300364295192499},
			{"weight": -2.9036061692080217}, {"weight": 4.132576329093505}, {"weight": -3.817976850598705},
			{"weight": 4.606542085589321}, {"weight": 2.8220313920923323}, {"weight": 2.3423002019828885},
			{"weight": 2.098573708791525}, {"weight": 4.4760505444141625}, {"weight": 3.95752484391276},
			{"weight": -0.7265226578414495}, {"weight": -4.316679309853457}]
	};
	neuralNet.setParameters(initialParameters);

	var mainDiv = d3.select("body")
	.append("div")
	.style("text-align", "center");

	/*
	var svg = mainDiv
	.append("svg")
	.attr("width", svgWidth)
	.attr("height", svgHeight)
	.style("vertical-align", "middle");
	*/

	var divCanvas = mainDiv
	.append("div")
	.style("position", "relative")
	.style("display", "inline-block")
	.style("vertical-align", "middle");

	var canvas = divCanvas.append("canvas")
	.attr("width", canvasWidth)
	.attr("height", canvasHeight);

	ctx = canvas.node().getContext("2d");

	var canvasSvg = divCanvas.append("svg")
	.attr("width", canvasWidth)
	.attr("height", canvasHeight)
	.style("position", "absolute")
	.style("left", "0px")
	.style("top", "0px")
	.style("z-index", "2");

	miniCanvasData = [];
	for (var i = 0; i < canvasWidthMini; i++) {
		miniCanvasData.push([]);
		for (var j = 0; j < canvasHeightMini; j++) {
			miniCanvasData[i].push(0);
		}
	}

	var divControls = mainDiv
	.append("div")
	.style("text-align", "left")
	.style("width", "180px")
	.style("display", "inline-block")
	.style("vertical-align", "middle")
	.style("padding-left", "25px");

	var btnRandomizeWeights = divControls
	.append("button")
	.html("Randomize weights")
	.style("text-align", "center")
	.on("click", randomizeWeights);

	// var $btnRandomizeWeights = $(btnRandomizeWeights[0]);
	// $btnRandomizeWeights.button();

	divControls.append("div")
	.html("<b>Learning rate</b>");

	var txtLearningRate = divControls
	.append("span")
	.text(learningRate);

	var sldLearningRate = divControls
	.append("div");

	sldLearningRate.call(d3.slider()
		.axis(d3.svg.axis().ticks(6))
		.min(0)
		.max(1)
		.step(0.01)
		.value(learningRate)
		.on("slide", function(event, value) {
			learningRate = value;
			txtLearningRate.text(roundDigits(learningRate, 2).toString());
		})
	)
	.style("margin-left", "0px")
	.style("margin-top", "2px")
	.style("margin-bottom", "17px");

	divControls.append("div")
	.html("<b>Regularization</b><br>");

	var txtRegularization = divControls
	.append("span")
	.text(regularization);

	var sldRegularization = divControls
	.append("div");

	sldRegularization.call(d3.slider()
		.axis(d3.svg.axis().ticks(3))
		.min(0)
		.max(0.0001)
		.step(0.0000001)
		.value(regularization)
		.on("slide", function(event, value) {
			regularization = value;
			txtRegularization.text(roundDigits(regularization, 5).toString());
		})
	)
	.style("margin-left", "0px")
	.style("margin-top", "2px")
	.style("margin-bottom", "17px");

	divInfo = divControls.append("div");

	d3Link = svg.append("svg:g").selectAll("path");
	d3Spike = svg.append("svg:g").selectAll("g");
	d3Neuron = svg.append("svg:g").selectAll("g");
	d3Sample = canvasSvg.append("svg:g").selectAll("g");

	t = 0;
	propagationT = 200;

	restart();

	firstPass = true;
	firingNeurons = [];

	/*
	firingNeurons = neuralNet.input;
	neuralNet.neurons[0].activation = 0.8;
	neuralNet.neurons[1].activation = 0.8;
	*/

	neuralNet.reset();
	setInterval(update, 1 / 30);
}

update = function() {
	var trainInfo = neuralNet.train(trainingSet, learningRate, regularization);
	updateCanvas();

	var totalLoss = trainInfo.dataLoss + trainInfo.regularizationLoss;
	var decimalDigits = 5;

	divInfo.html(
	"<b>Data loss:</b><br>" +
	roundDigits(trainInfo.dataLoss, decimalDigits) + "<br>" +
	"<b>Regularization loss:</b><br>" +
	roundDigits(trainInfo.regularizationLoss, decimalDigits) + "<br>" +
	"<b>Total loss:</b><br>" +
	roundDigits(totalLoss, decimalDigits) + "<br>");

	if (t >= propagationT) {
		t = propagationT;
		var newFiringNeurons = [];
		for (var i = 0; i < firingNeurons.length; i++) {
			var neuron = firingNeurons[i];
			for (var j = 0; j < neuron.links.length; j++) {
				var link = neuron.links[j];
				if (newFiringNeurons.indexOf(link.nf) == -1) {
					newFiringNeurons.push(link.nf);
				}
			}
		}
		firingNeurons = newFiringNeurons;
		t = 0;
	} else
	if (t == 0) {
		if (firstPass) {
			firstPass = false;
		} else {
			for (var i = 0; i < firingNeurons.length; i++) {
				var neuron = firingNeurons[i];
				neuron.update();
			}
		}

		for (var i = 0; i < firingNeurons.length; i++) {
			var neuron = firingNeurons[i];
			for (var j = 0; j < firingNeurons[i].links.length; j++) {
				var spike = neuron.links[j].spike;
				spike.radius = maxSpikeRadius * Math.min(1, Math.abs(spike.getMagnitude()) / preactivationTop);
			}
		}

		t++;
	} else {
		t++;
	}

	for (var i = 0; i < firingNeurons.length; i++) {
		for (var j = 0; j < firingNeurons[i].links.length; j++) {
			var spike = firingNeurons[i].links[j].spike;
			var link = spike.link;

			var v = link.nf.pos.subtract(link.n0.pos).normalize();
			var p0 = link.n0.pos.add(v.times(neuronRadius - spike.radius));
			var pf = link.nf.pos.subtract(v.times(neuronRadius - spike.radius));
			v = pf.subtract(p0);
			spike.pos = p0.add(v.times(t / propagationT));
		}
	}

	// draw directed edges with proper padding from node centers
	d3Link.attr("d", function(d) {
		var deltaX = d.nf.pos.x - d.n0.pos.x,
			deltaY = d.nf.pos.y - d.n0.pos.y,
			dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY),
			normX = deltaX / dist,
			normY = deltaY / dist,
			sourcePadding = d.left ? neuronRadius - 5 : neuronRadius,
			targetPadding = d.right ? neuronRadius - 5: neuronRadius,
			sourceX = d.n0.pos.x + (sourcePadding * normX),
			sourceY = d.n0.pos.y + (sourcePadding * normY),
			targetX = d.nf.pos.x - (targetPadding * normX),
			targetY = d.nf.pos.y - (targetPadding * normY);
		return "M" + sourceX + "," + sourceY + "L" + targetX + "," + targetY;
	});

	d3Neuron.attr("transform", function(d) {
		return "translate(" + d.pos.x + "," + d.pos.y + ")";
	})
	.selectAll("circle").style("fill", function(d) {
		var v = Math.abs(d.activation);
		return colorBlend(cBlue, cRed, v);
	});

	d3Link
	.style("stroke-width", function(d) {
		return maxSpikeRadius * 2 * Math.min(1, Math.abs(d.weight) / preactivationTop);
	});

	d3Spike.attr("transform", function(d) {
		return "translate(" + d.pos.x + "," + d.pos.y + ")";
	});
	d3Spike.selectAll("circle").attr("r", function(d) { return d.radius; });
}

randomizeWeights = function() {
	neuralNet.randomizeWeights();
	// bias of 2 inputs must be 0
	neuralNet.neurons[0].bias = 0;
	neuralNet.neurons[1].bias = 0;
}

restart = function() {
	var g;

	d3Link = d3Link.data(neuralNet.links);

	d3Link.enter().append("svg:path")
	.attr("class", "link")
	.style("stroke-width", function(d) {
		return 1; // maxSpikeRadius * 2 * Math.min(1, Math.abs(d.weight) / preactivationTop);
	})
	.style("stroke", function(d) {
		if (d.weight > 0) {
			return cBlue;
		} else {
			return cRed;
		}
	})
	.style("stroke-opacity", function(d) { return 0.4; });

	d3Link.exit().remove();

	d3Neuron = d3Neuron.data(neuralNet.neurons);
	g = d3Neuron.enter().append("svg:g");

	g.append("svg:circle")
	.attr("class", "neuron")
	.attr("r", neuronRadius)
	.style("stroke", function(d) { return d3.rgb(0, 0, 0); });

	d3Neuron.exit().remove();

	d3Spike = d3Spike.data(neuralNet.spikes);
	g = d3Spike.enter().append("svg:g");

	g.append("svg:circle")
	.attr("class", "spike")
	.attr("fill", function(d) {
		if (d.link.weight > 0) {
			return cBlue;
		} else {
			return cRed;
		}
	});

	d3Spike.exit().remove();

	d3Sample = d3Sample.data(trainingSet);
	g = d3Sample.enter().append("svg:g");

	g.append("svg:circle")
	.attr("class", "sample")
	.attr("r", 3)
	.style("stroke", function(d) { return d3.rgb(0, 0, 0) })
	.style("fill", function(d) {
		if (d.y == 1) return cBlue;
		else return cRed;
	});

	d3Sample.attr("transform", function(d) {
		return "translate(" + d.x[0] * canvasWidth + "," + d.x[1] * canvasHeight + ")";
	});

	d3Sample.exit().remove();

	updateCanvas();

}

updateCanvas = function() {
	var d;
	for (var i = 0; i < canvasWidthMini; i++) {
		for (var j = 0; j < canvasHeightMini; j++) {
			var output = neuralNet.computeOutput([i / canvasWidthMini, j / canvasHeightMini]);
			var v = output[0];
			if (v > maxOutputPaint) d = cLightBlue;
			else if (v < minOutputPaint) d = cLightRed;
			else {
				v = (v - minOutputPaint) / (maxOutputPaint - minOutputPaint);
				d = colorBlend(cLightBlue, cLightRed, v);
			}

			miniCanvasData[i][j] = d;
		}
	}

	var imgData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
	var imgDataLen = imgData.data.length;
	for (var i = 0; i < imgDataLen / 4; i++) {
		var y = Math.floor(i / canvasWidth);
		var x = i % canvasWidth;
		var d = miniCanvasData[Math.floor(x / fWidth)][Math.floor(y / fHeight)];
		imgData.data[4 * i] = d.r;
		imgData.data[4 * i + 1] = d.g;
		imgData.data[4 * i + 2] = d.b;
		imgData.data[4 * i + 3] = 255;
	}
	ctx.putImageData(imgData, 0, 0);

	neuralNet.reset();
}

init();

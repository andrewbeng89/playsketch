var socket = io.connect('/');

var $ = function (id) {
    return document.getElementById(id)
};

var canvas = new fabric.Canvas('c', {
    isDrawingMode: true
});

var currentData, changedData, delta, $state;

// Undo and Redo stacks
var undo = [],
	redo = [];

var drawingModeEl = $('drawing-mode'),
eraseModeEl = $('erase-mode'),
undoEl = $('undo'),
redoEl = $('redo'),
drawingOptionsEl = $('drawing-mode-options'),
drawingColorEl = $('drawing-color'),
drawingShadowColorEl = $('drawing-shadow-color'),
drawingLineWidthEl = $('drawing-line-width'),
drawingShadowWidth = $('drawing-shadow-width'),
drawingShadowOffset = $('drawing-shadow-offset'),
clearEl = $('clear-canvas');

clearEl.onclick = function () {
    canvas.clear();
    changeCallback({});
};

undoEl.onclick = function() {
	canvasUndo();
}

redoEl.onclick = function() {
	canvasRedo();
}

drawingModeEl.onclick = function () {
    canvas.isDrawingMode = !canvas.isDrawingMode;
    if (canvas.isDrawingMode) {
        canvas.off('object:selected', removeOnClick);
        drawingModeEl.innerHTML = 'Cancel drawing mode';
        eraseModeEl.innerHTML = 'Enter erase mode';
        drawingOptionsEl.style.display = '';
    } else {
        canvas.off('object:selected', removeOnClick);
        drawingModeEl.innerHTML = 'Enter drawing mode';
        eraseModeEl.innerHTML = 'Enter erase mode';
        drawingOptionsEl.style.display = 'none';
    }
};

function removeOnClick() {
	var objectToErase = canvas.getActiveObject();
	objectToErase.remove();
	changeCallback({});
}

eraseModeEl.onclick = function () {
    canvas.isDrawingMode = !canvas.isDrawingMode;
    if (canvas.isDrawingMode) {
    	eraseModeEl.innerHTML = 'Enter erase mode';
    	drawingModeEl.innerHTML = 'Cancel drawing mode';
        drawingOptionsEl.style.display = '';
        canvas.off('object:selected', removeOnClick);
    } else {
        eraseModeEl.innerHTML = 'Cancel erase mode';
        drawingModeEl.innerHTML = 'Enter drawing mode';
        drawingOptionsEl.style.display = 'none';
        canvas.on('object:selected', removeOnClick);
        console.log(typeof canvas);
    }
};

if (fabric.PatternBrush) {
    var vLinePatternBrush = new fabric.PatternBrush(canvas);
    vLinePatternBrush.getPatternSrc = function () {

        var patternCanvas = fabric.document.createElement('canvas');
        patternCanvas.width = patternCanvas.height = 10;
        var ctx = patternCanvas.getContext('2d');

        ctx.strokeStyle = this.color;
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(0, 5);
        ctx.lineTo(10, 5);
        ctx.closePath();
        ctx.stroke();

        return patternCanvas;
    };

    var hLinePatternBrush = new fabric.PatternBrush(canvas);
    hLinePatternBrush.getPatternSrc = function () {

        var patternCanvas = fabric.document.createElement('canvas');
        patternCanvas.width = patternCanvas.height = 10;
        var ctx = patternCanvas.getContext('2d');

        ctx.strokeStyle = this.color;
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(5, 0);
        ctx.lineTo(5, 10);
        ctx.closePath();
        ctx.stroke();

        return patternCanvas;
    };

    var squarePatternBrush = new fabric.PatternBrush(canvas);
    squarePatternBrush.getPatternSrc = function () {

        var squareWidth = 10,
        squareDistance = 2;

        var patternCanvas = fabric.document.createElement('canvas');
        patternCanvas.width = patternCanvas.height = squareWidth + squareDistance;
        var ctx = patternCanvas.getContext('2d');

        ctx.fillStyle = this.color;
        ctx.fillRect(0, 0, squareWidth, squareWidth);

        return patternCanvas;
    };

    var diamondPatternBrush = new fabric.PatternBrush(canvas);
    diamondPatternBrush.getPatternSrc = function () {

        var squareWidth = 10,
        squareDistance = 5;
        var patternCanvas = fabric.document.createElement('canvas');
        var rect = new fabric.Rect({
            width: squareWidth,
            height: squareWidth,
            angle: 45,
            fill: this.color
        });

        var canvasWidth = rect.getBoundingRectWidth();

        patternCanvas.width = patternCanvas.height = canvasWidth + squareDistance;
        rect.set({
            left: canvasWidth / 2,
            top: canvasWidth / 2
        });

        var ctx = patternCanvas.getContext('2d');
        rect.render(ctx);

        return patternCanvas;
    };

    var img = new Image();
    img.src = './images/honey_im_subtle.png';

    var texturePatternBrush = new fabric.PatternBrush(canvas);
    texturePatternBrush.source = img;
}

$('drawing-mode-selector').onchange = function () {

    if (this.value === 'hline') {
        canvas.freeDrawingBrush = vLinePatternBrush;
    } else if (this.value === 'vline') {
        canvas.freeDrawingBrush = hLinePatternBrush;
    } else if (this.value === 'square') {
        canvas.freeDrawingBrush = squarePatternBrush;
    } else if (this.value === 'diamond') {
        canvas.freeDrawingBrush = diamondPatternBrush;
    } else if (this.value === 'texture') {
        canvas.freeDrawingBrush = texturePatternBrush;
    } else {
        canvas.freeDrawingBrush = new fabric[this.value + 'Brush'](canvas);
    }

    if (canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush.color = drawingColorEl.value;
        canvas.freeDrawingBrush.width = parseInt(drawingLineWidthEl.value, 10) || 1;
        canvas.freeDrawingBrush.shadowBlur = parseInt(drawingShadowWidth.value, 10) || 0;
    }
};

drawingColorEl.onchange = function () {
    canvas.freeDrawingBrush.color = this.value;
};
drawingShadowColorEl.onchange = function () {
    canvas.freeDrawingBrush.shadowColor = this.value;
};
drawingLineWidthEl.onchange = function () {
    canvas.freeDrawingBrush.width = parseInt(this.value, 10) || 1;
    this.previousSibling.innerHTML = this.value;
};
drawingShadowWidth.onchange = function () {
    canvas.freeDrawingBrush.shadowBlur = parseInt(this.value, 10) || 0;
    this.previousSibling.innerHTML = this.value;
};
drawingShadowOffset.onchange = function () {
    canvas.freeDrawingBrush.shadowOffsetX = canvas.freeDrawingBrush.shadowOffsetY = parseInt(this.value, 10) || 0;
    this.previousSibling.innerHTML = this.value;
};

if (canvas.freeDrawingBrush) {
    canvas.freeDrawingBrush.color = drawingColorEl.value;
    canvas.freeDrawingBrush.width = parseInt(drawingLineWidthEl.value, 10) || 1;
    canvas.freeDrawingBrush.shadowBlur = 0;
}

function canvasUndo() {
	if (undo.length > 0) {
		var lastOp = undo.pop();
		redo.push(lastOp);
		currentData = canvas.toJSON();
		canvas.loadFromJSON(lastOp, function() {
            canvas.renderAll();
            changeCallback({}, true, lastOp);
        });
	} else {
		console.log("no undo operations");
	}
}

function canvasRedo() {
	if (redo.length > 0) {
		var lastOp = redo.pop();
		undo.push(lastOp);
		currentData = canvas.toJSON();
		canvas.loadFromJSON(lastOp, function() {
            canvas.renderAll();
            changeCallback({}, true, lastOp);
        });
	} else {
		console.log("no redo operations");
	}
}

function changeCallback(e, undo_redo, lastOp) {
    console.log({e:e});
    changedData = (undo_redo === true) ? lastOp : canvas.toJSON();
    delta = jsondiffpatch.diff(currentData.objects, changedData.objects);
    if (e.path) {
    	$state.submitOp({
    		p: ['objects', currentData.objects.length],
    		li: e.path
    	});
    } else {
    	$state.submitOp({
        	p: [''],
        	od: currentData,
        	oi: changedData
    	});
    }
    if (undo_redo !== true || undo_redo === undefined) {
    	if (currentData !== undo[undo.length - 1]) {
    		undo.push(currentData);
    	}
    }
    currentData = changedData;
    $state.set(currentData);
}

if (!document.location.hash) {
    document.location.hash = '#' + randomDocName();
}
var docname = 'hex:' + document.location.hash.slice(1)

canvas.on('path:created', changeCallback);
canvas.on('object:modified', changeCallback);

sharejs.open(docname, 'json', function(error, doc) {
    $state = doc;
    doc.on('change', function (op) {
        stateUpdated(op);
    });
    console.log({created:doc.created});
    if (doc.created) {
        // Newly created
        currentData = canvas.toJSON();
        undo.push(currentData);
        console.log(doc);
        stateUpdated();
    } else {
        // Retrieved doc
        currentData = doc.get();
        undo.push(currentData);
        delete currentData[''];
        console.log({currentData:currentData});
        stateUpdated();
    }
});

function randomDocName(length) {
    var chars, x;
    if (length == null) {
        length = 10;
    }
    chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-=";
    var name = [];
    for (x = 0; x < length; x++) {
        name.push(chars[Math.floor(Math.random() * chars.length)]);
    }
    return name.join('');
}

function stateUpdated(op) {
    if (op) {
        console.log({operation:op});
        if (op[0].li) {
        	currentData.objects.push(op[0].li);
        } else {
        	currentData = op[0].oi;
        }
        console.log(currentData);
        canvas.loadFromJSON(currentData, function() {
            canvas.renderAll();
        });
        console.log('Version: ' + $state.version);
    } else {
        $state.set(currentData);
        canvas.loadFromJSON(currentData, function() {
            canvas.renderAll();
        });
    }
}
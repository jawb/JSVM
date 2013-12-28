var filedrag = $("#filedrag");
var code = $("#code");
var control = $("#control");
var stack = $("#stack ul");
var tblsymb = $("#tblsymb");
var myConsole = $("#console");

var reader = new FileReader();
reader.onloadend = function(e) {
    if (e.target.readyState == FileReader.DONE) {
        VM.loadFile(e.target.result, function (contents, labels) {
            console.log(labels);
            contents.forEach(function (line, i) {
                code.append('<tr class="text-muted"><td>'+((!!labels[i])?labels[i]:"")+'</td><td>'+line+'</td></tr>');
            });
            filedrag.hide();
            control.show();
        });
    }
};

VM.onStackPush = function (arg) {
    stack.append('<li>'+arg+'</li>');
};

VM.onStackPop = function () {
    stack.find(':last-child').remove();
};

VM.onTsAdd = function (name, val) {
    tblsymb.append('<tr><td>'+name+'</td><td>'+val+'</td></tr>');
};

VM.onTsStore = function (i, val) {
    tblsymb.find('tr:nth-child('+(i+1)+') td:last-child').text(val);
};

VM.onPcUpdate = function (pc) {
    code.find('tr').removeClass('current-code');
    code.find('tr:nth-child('+pc+')').addClass('current-code');
};

VM.onReset = function () {
    code.empty();
    stack.empty();
    tblsymb.empty();
    myConsole.html(" &gt; ");
};

VM.print = function (str) {
    str = str.replace('\n', '<br/>');
    myConsole.append(str);
};

VM.read = function () {
    var str = prompt("Input", "");
    return str;
};

$('#executeOne').click(function (e) {
    VM.executeOne();
});

$('#executeAll').click(function (e) {
    execute = setInterval(function () { VM.executeOne(); }, 200);
});

$('#executePause').click(function (e) {
    clearInterval(execute);
});

$('#executeStop').click(function (e) {
    clearInterval(execute);
    VM.reset();
    filedrag.show();
    control.hide();
});
    
filedrag.on('drop', function(e) {
    e.stopPropagation();
    e.preventDefault();
    var file = e.originalEvent.dataTransfer.files[0];
    reader.readAsText(file);
});

filedrag.on('dragover', function(e) {
    e.stopPropagation();
    e.preventDefault();
    filedrag.addClass('dragover');
});

filedrag.on('dragleave', function(e) {
    e.stopPropagation();
    e.preventDefault();
    filedrag.removeClass('dragover');
});

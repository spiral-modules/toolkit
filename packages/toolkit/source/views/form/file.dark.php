<extends:spiral:element/>

<block:resources>
</block:resources>

<block:body>
    <div class="file-field item-form">
        <input type="file" id="${id}" class="inputfile sf-js-file-input" data-file="true" data-multiple-caption="{count} ${multiple-text | files selected}" node:attributes/>
        <label for="${id}">
            <span class="btn ${class}">${label | Choose file}</span>
        </label>
    </div>
</block:body>
<extends:spiral:element/>

<block:body>
    <label class="item-form ${wrapper-class}">
        <?php #compiled
        //Receiving label content as evaluator variable
        $this->evaluatorVariable('label', '${label}');
        if (!empty($label) && $label != "''") {
            ?>
            <block:input-label>
                <span class="item-label">${label}</span>
            </block:input-label>
            <?php #compiled
        }
        ?>
        <block:input-body>
            <input type="${type|text}" name="${name}" value="${value}${context}" class="item-input" node:attributes/>
        </block:input-body>
    </label>
</block:body>
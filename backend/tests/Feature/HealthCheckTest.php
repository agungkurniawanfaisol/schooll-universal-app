<?php

it('returns ok on health endpoint', function () {
    $this->get('/up')->assertOk();
});

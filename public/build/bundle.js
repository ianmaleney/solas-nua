
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot(slot, slot_definition, ctx, $$scope, dirty, get_slot_changes_fn, get_slot_context_fn) {
        const slot_changes = get_slot_changes(slot_definition, $$scope, dirty, get_slot_changes_fn);
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function compute_rest_props(props, keys) {
        const rest = {};
        keys = new Set(keys);
        for (const k in props)
            if (!keys.has(k) && k[0] !== '$')
                rest[k] = props[k];
        return rest;
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_attributes(node, attributes) {
        // @ts-ignore
        const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
        for (const key in attributes) {
            if (attributes[key] == null) {
                node.removeAttribute(key);
            }
            else if (key === 'style') {
                node.style.cssText = attributes[key];
            }
            else if (key === '__value') {
                node.value = node[key] = attributes[key];
            }
            else if (descriptors[key] && descriptors[key].set) {
                node[key] = attributes[key];
            }
            else {
                attr(node, key, attributes[key]);
            }
        }
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    const active_docs = new Set();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = node.ownerDocument;
        active_docs.add(doc);
        const stylesheet = doc.__svelte_stylesheet || (doc.__svelte_stylesheet = doc.head.appendChild(element('style')).sheet);
        const current_rules = doc.__svelte_rules || (doc.__svelte_rules = {});
        if (!current_rules[name]) {
            current_rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            active_docs.forEach(doc => {
                const stylesheet = doc.__svelte_stylesheet;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                doc.__svelte_rules = {};
            });
            active_docs.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function afterUpdate(fn) {
        get_current_component().$$.after_update.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
    }
    function getContext(key) {
        return get_current_component().$$.context.get(key);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    const null_transition = { duration: 0 };
    function create_in_transition(node, fn, params) {
        let config = fn(node, params);
        let running = false;
        let animation_name;
        let task;
        let uid = 0;
        function cleanup() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
            tick(0, 1);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            if (task)
                task.abort();
            running = true;
            add_render_callback(() => dispatch(node, true, 'start'));
            task = loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(1, 0);
                        dispatch(node, true, 'end');
                        cleanup();
                        return running = false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(t, 1 - t);
                    }
                }
                return running;
            });
        }
        let started = false;
        return {
            start() {
                if (started)
                    return;
                delete_rule(node);
                if (is_function(config)) {
                    config = config();
                    wait().then(go);
                }
                else {
                    go();
                }
            },
            invalidate() {
                started = false;
            },
            end() {
                if (running) {
                    cleanup();
                    running = false;
                }
            }
        };
    }
    function create_out_transition(node, fn, params) {
        let config = fn(node, params);
        let running = true;
        let animation_name;
        const group = outros;
        group.r += 1;
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 1, 0, duration, delay, easing, css);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            add_render_callback(() => dispatch(node, false, 'start'));
            loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(0, 1);
                        dispatch(node, false, 'end');
                        if (!--group.r) {
                            // this will result in `end()` being called,
                            // so we don't need to clean up here
                            run_all(group.c);
                        }
                        return false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(1 - t, t);
                    }
                }
                return running;
            });
        }
        if (is_function(config)) {
            wait().then(() => {
                // @ts-ignore
                config = config();
                go();
            });
        }
        else {
            go();
        }
        return {
            end(reset) {
                if (reset && config.tick) {
                    config.tick(1, 0);
                }
                if (running) {
                    if (animation_name)
                        delete_rule(node, animation_name);
                    running = false;
                }
            }
        };
    }

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.32.3' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = [];
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (let i = 0; i < subscribers.length; i += 1) {
                        const s = subscribers[i];
                        s[1]();
                        subscriber_queue.push(s, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.push(subscriber);
            if (subscribers.length === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                const index = subscribers.indexOf(subscriber);
                if (index !== -1) {
                    subscribers.splice(index, 1);
                }
                if (subscribers.length === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    const themeColour = writable("#e4d4c5");
    const headerOpacity = writable(1);
    const blob1 = writable("#f2cb90");
    const blob2 = writable("#b9b4ba");

    const LOCATION = {};
    const ROUTER = {};

    /**
     * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/history.js
     *
     * https://github.com/reach/router/blob/master/LICENSE
     * */

    function getLocation(source) {
      return {
        ...source.location,
        state: source.history.state,
        key: (source.history.state && source.history.state.key) || "initial"
      };
    }

    function createHistory(source, options) {
      const listeners = [];
      let location = getLocation(source);

      return {
        get location() {
          return location;
        },

        listen(listener) {
          listeners.push(listener);

          const popstateListener = () => {
            location = getLocation(source);
            listener({ location, action: "POP" });
          };

          source.addEventListener("popstate", popstateListener);

          return () => {
            source.removeEventListener("popstate", popstateListener);

            const index = listeners.indexOf(listener);
            listeners.splice(index, 1);
          };
        },

        navigate(to, { state, replace = false } = {}) {
          state = { ...state, key: Date.now() + "" };
          // try...catch iOS Safari limits to 100 pushState calls
          try {
            if (replace) {
              source.history.replaceState(state, null, to);
            } else {
              source.history.pushState(state, null, to);
            }
          } catch (e) {
            source.location[replace ? "replace" : "assign"](to);
          }

          location = getLocation(source);
          listeners.forEach(listener => listener({ location, action: "PUSH" }));
        }
      };
    }

    // Stores history entries in memory for testing or other platforms like Native
    function createMemorySource(initialPathname = "/") {
      let index = 0;
      const stack = [{ pathname: initialPathname, search: "" }];
      const states = [];

      return {
        get location() {
          return stack[index];
        },
        addEventListener(name, fn) {},
        removeEventListener(name, fn) {},
        history: {
          get entries() {
            return stack;
          },
          get index() {
            return index;
          },
          get state() {
            return states[index];
          },
          pushState(state, _, uri) {
            const [pathname, search = ""] = uri.split("?");
            index++;
            stack.push({ pathname, search });
            states.push(state);
          },
          replaceState(state, _, uri) {
            const [pathname, search = ""] = uri.split("?");
            stack[index] = { pathname, search };
            states[index] = state;
          }
        }
      };
    }

    // Global history uses window.history as the source if available,
    // otherwise a memory history
    const canUseDOM = Boolean(
      typeof window !== "undefined" &&
        window.document &&
        window.document.createElement
    );
    const globalHistory = createHistory(canUseDOM ? window : createMemorySource());
    const { navigate } = globalHistory;

    /**
     * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/utils.js
     *
     * https://github.com/reach/router/blob/master/LICENSE
     * */

    const paramRe = /^:(.+)/;

    const SEGMENT_POINTS = 4;
    const STATIC_POINTS = 3;
    const DYNAMIC_POINTS = 2;
    const SPLAT_PENALTY = 1;
    const ROOT_POINTS = 1;

    /**
     * Check if `string` starts with `search`
     * @param {string} string
     * @param {string} search
     * @return {boolean}
     */
    function startsWith(string, search) {
      return string.substr(0, search.length) === search;
    }

    /**
     * Check if `segment` is a root segment
     * @param {string} segment
     * @return {boolean}
     */
    function isRootSegment(segment) {
      return segment === "";
    }

    /**
     * Check if `segment` is a dynamic segment
     * @param {string} segment
     * @return {boolean}
     */
    function isDynamic(segment) {
      return paramRe.test(segment);
    }

    /**
     * Check if `segment` is a splat
     * @param {string} segment
     * @return {boolean}
     */
    function isSplat(segment) {
      return segment[0] === "*";
    }

    /**
     * Split up the URI into segments delimited by `/`
     * @param {string} uri
     * @return {string[]}
     */
    function segmentize(uri) {
      return (
        uri
          // Strip starting/ending `/`
          .replace(/(^\/+|\/+$)/g, "")
          .split("/")
      );
    }

    /**
     * Strip `str` of potential start and end `/`
     * @param {string} str
     * @return {string}
     */
    function stripSlashes(str) {
      return str.replace(/(^\/+|\/+$)/g, "");
    }

    /**
     * Score a route depending on how its individual segments look
     * @param {object} route
     * @param {number} index
     * @return {object}
     */
    function rankRoute(route, index) {
      const score = route.default
        ? 0
        : segmentize(route.path).reduce((score, segment) => {
            score += SEGMENT_POINTS;

            if (isRootSegment(segment)) {
              score += ROOT_POINTS;
            } else if (isDynamic(segment)) {
              score += DYNAMIC_POINTS;
            } else if (isSplat(segment)) {
              score -= SEGMENT_POINTS + SPLAT_PENALTY;
            } else {
              score += STATIC_POINTS;
            }

            return score;
          }, 0);

      return { route, score, index };
    }

    /**
     * Give a score to all routes and sort them on that
     * @param {object[]} routes
     * @return {object[]}
     */
    function rankRoutes(routes) {
      return (
        routes
          .map(rankRoute)
          // If two routes have the exact same score, we go by index instead
          .sort((a, b) =>
            a.score < b.score ? 1 : a.score > b.score ? -1 : a.index - b.index
          )
      );
    }

    /**
     * Ranks and picks the best route to match. Each segment gets the highest
     * amount of points, then the type of segment gets an additional amount of
     * points where
     *
     *  static > dynamic > splat > root
     *
     * This way we don't have to worry about the order of our routes, let the
     * computers do it.
     *
     * A route looks like this
     *
     *  { path, default, value }
     *
     * And a returned match looks like:
     *
     *  { route, params, uri }
     *
     * @param {object[]} routes
     * @param {string} uri
     * @return {?object}
     */
    function pick(routes, uri) {
      let match;
      let default_;

      const [uriPathname] = uri.split("?");
      const uriSegments = segmentize(uriPathname);
      const isRootUri = uriSegments[0] === "";
      const ranked = rankRoutes(routes);

      for (let i = 0, l = ranked.length; i < l; i++) {
        const route = ranked[i].route;
        let missed = false;

        if (route.default) {
          default_ = {
            route,
            params: {},
            uri
          };
          continue;
        }

        const routeSegments = segmentize(route.path);
        const params = {};
        const max = Math.max(uriSegments.length, routeSegments.length);
        let index = 0;

        for (; index < max; index++) {
          const routeSegment = routeSegments[index];
          const uriSegment = uriSegments[index];

          if (routeSegment !== undefined && isSplat(routeSegment)) {
            // Hit a splat, just grab the rest, and return a match
            // uri:   /files/documents/work
            // route: /files/* or /files/*splatname
            const splatName = routeSegment === "*" ? "*" : routeSegment.slice(1);

            params[splatName] = uriSegments
              .slice(index)
              .map(decodeURIComponent)
              .join("/");
            break;
          }

          if (uriSegment === undefined) {
            // URI is shorter than the route, no match
            // uri:   /users
            // route: /users/:userId
            missed = true;
            break;
          }

          let dynamicMatch = paramRe.exec(routeSegment);

          if (dynamicMatch && !isRootUri) {
            const value = decodeURIComponent(uriSegment);
            params[dynamicMatch[1]] = value;
          } else if (routeSegment !== uriSegment) {
            // Current segments don't match, not dynamic, not splat, so no match
            // uri:   /users/123/settings
            // route: /users/:id/profile
            missed = true;
            break;
          }
        }

        if (!missed) {
          match = {
            route,
            params,
            uri: "/" + uriSegments.slice(0, index).join("/")
          };
          break;
        }
      }

      return match || default_ || null;
    }

    /**
     * Check if the `path` matches the `uri`.
     * @param {string} path
     * @param {string} uri
     * @return {?object}
     */
    function match(route, uri) {
      return pick([route], uri);
    }

    /**
     * Add the query to the pathname if a query is given
     * @param {string} pathname
     * @param {string} [query]
     * @return {string}
     */
    function addQuery(pathname, query) {
      return pathname + (query ? `?${query}` : "");
    }

    /**
     * Resolve URIs as though every path is a directory, no files. Relative URIs
     * in the browser can feel awkward because not only can you be "in a directory",
     * you can be "at a file", too. For example:
     *
     *  browserSpecResolve('foo', '/bar/') => /bar/foo
     *  browserSpecResolve('foo', '/bar') => /foo
     *
     * But on the command line of a file system, it's not as complicated. You can't
     * `cd` from a file, only directories. This way, links have to know less about
     * their current path. To go deeper you can do this:
     *
     *  <Link to="deeper"/>
     *  // instead of
     *  <Link to=`{${props.uri}/deeper}`/>
     *
     * Just like `cd`, if you want to go deeper from the command line, you do this:
     *
     *  cd deeper
     *  # not
     *  cd $(pwd)/deeper
     *
     * By treating every path as a directory, linking to relative paths should
     * require less contextual information and (fingers crossed) be more intuitive.
     * @param {string} to
     * @param {string} base
     * @return {string}
     */
    function resolve(to, base) {
      // /foo/bar, /baz/qux => /foo/bar
      if (startsWith(to, "/")) {
        return to;
      }

      const [toPathname, toQuery] = to.split("?");
      const [basePathname] = base.split("?");
      const toSegments = segmentize(toPathname);
      const baseSegments = segmentize(basePathname);

      // ?a=b, /users?b=c => /users?a=b
      if (toSegments[0] === "") {
        return addQuery(basePathname, toQuery);
      }

      // profile, /users/789 => /users/789/profile
      if (!startsWith(toSegments[0], ".")) {
        const pathname = baseSegments.concat(toSegments).join("/");

        return addQuery((basePathname === "/" ? "" : "/") + pathname, toQuery);
      }

      // ./       , /users/123 => /users/123
      // ../      , /users/123 => /users
      // ../..    , /users/123 => /
      // ../../one, /a/b/c/d   => /a/b/one
      // .././one , /a/b/c/d   => /a/b/c/one
      const allSegments = baseSegments.concat(toSegments);
      const segments = [];

      allSegments.forEach(segment => {
        if (segment === "..") {
          segments.pop();
        } else if (segment !== ".") {
          segments.push(segment);
        }
      });

      return addQuery("/" + segments.join("/"), toQuery);
    }

    /**
     * Combines the `basepath` and the `path` into one path.
     * @param {string} basepath
     * @param {string} path
     */
    function combinePaths(basepath, path) {
      return `${stripSlashes(
    path === "/" ? basepath : `${stripSlashes(basepath)}/${stripSlashes(path)}`
  )}/`;
    }

    /**
     * Decides whether a given `event` should result in a navigation or not.
     * @param {object} event
     */
    function shouldNavigate(event) {
      return (
        !event.defaultPrevented &&
        event.button === 0 &&
        !(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey)
      );
    }

    /* node_modules/svelte-routing/src/Router.svelte generated by Svelte v3.32.3 */

    function create_fragment(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[9].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[8], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 256) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[8], dirty, null, null);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let $base;
    	let $location;
    	let $routes;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Router", slots, ['default']);
    	let { basepath = "/" } = $$props;
    	let { url = null } = $$props;
    	const locationContext = getContext(LOCATION);
    	const routerContext = getContext(ROUTER);
    	const routes = writable([]);
    	validate_store(routes, "routes");
    	component_subscribe($$self, routes, value => $$invalidate(7, $routes = value));
    	const activeRoute = writable(null);
    	let hasActiveRoute = false; // Used in SSR to synchronously set that a Route is active.

    	// If locationContext is not set, this is the topmost Router in the tree.
    	// If the `url` prop is given we force the location to it.
    	const location = locationContext || writable(url ? { pathname: url } : globalHistory.location);

    	validate_store(location, "location");
    	component_subscribe($$self, location, value => $$invalidate(6, $location = value));

    	// If routerContext is set, the routerBase of the parent Router
    	// will be the base for this Router's descendants.
    	// If routerContext is not set, the path and resolved uri will both
    	// have the value of the basepath prop.
    	const base = routerContext
    	? routerContext.routerBase
    	: writable({ path: basepath, uri: basepath });

    	validate_store(base, "base");
    	component_subscribe($$self, base, value => $$invalidate(5, $base = value));

    	const routerBase = derived([base, activeRoute], ([base, activeRoute]) => {
    		// If there is no activeRoute, the routerBase will be identical to the base.
    		if (activeRoute === null) {
    			return base;
    		}

    		const { path: basepath } = base;
    		const { route, uri } = activeRoute;

    		// Remove the potential /* or /*splatname from
    		// the end of the child Routes relative paths.
    		const path = route.default
    		? basepath
    		: route.path.replace(/\*.*$/, "");

    		return { path, uri };
    	});

    	function registerRoute(route) {
    		const { path: basepath } = $base;
    		let { path } = route;

    		// We store the original path in the _path property so we can reuse
    		// it when the basepath changes. The only thing that matters is that
    		// the route reference is intact, so mutation is fine.
    		route._path = path;

    		route.path = combinePaths(basepath, path);

    		if (typeof window === "undefined") {
    			// In SSR we should set the activeRoute immediately if it is a match.
    			// If there are more Routes being registered after a match is found,
    			// we just skip them.
    			if (hasActiveRoute) {
    				return;
    			}

    			const matchingRoute = match(route, $location.pathname);

    			if (matchingRoute) {
    				activeRoute.set(matchingRoute);
    				hasActiveRoute = true;
    			}
    		} else {
    			routes.update(rs => {
    				rs.push(route);
    				return rs;
    			});
    		}
    	}

    	function unregisterRoute(route) {
    		routes.update(rs => {
    			const index = rs.indexOf(route);
    			rs.splice(index, 1);
    			return rs;
    		});
    	}

    	if (!locationContext) {
    		// The topmost Router in the tree is responsible for updating
    		// the location store and supplying it through context.
    		onMount(() => {
    			const unlisten = globalHistory.listen(history => {
    				location.set(history.location);
    			});

    			return unlisten;
    		});

    		setContext(LOCATION, location);
    	}

    	setContext(ROUTER, {
    		activeRoute,
    		base,
    		routerBase,
    		registerRoute,
    		unregisterRoute
    	});

    	const writable_props = ["basepath", "url"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Router> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("basepath" in $$props) $$invalidate(3, basepath = $$props.basepath);
    		if ("url" in $$props) $$invalidate(4, url = $$props.url);
    		if ("$$scope" in $$props) $$invalidate(8, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		setContext,
    		onMount,
    		writable,
    		derived,
    		LOCATION,
    		ROUTER,
    		globalHistory,
    		pick,
    		match,
    		stripSlashes,
    		combinePaths,
    		basepath,
    		url,
    		locationContext,
    		routerContext,
    		routes,
    		activeRoute,
    		hasActiveRoute,
    		location,
    		base,
    		routerBase,
    		registerRoute,
    		unregisterRoute,
    		$base,
    		$location,
    		$routes
    	});

    	$$self.$inject_state = $$props => {
    		if ("basepath" in $$props) $$invalidate(3, basepath = $$props.basepath);
    		if ("url" in $$props) $$invalidate(4, url = $$props.url);
    		if ("hasActiveRoute" in $$props) hasActiveRoute = $$props.hasActiveRoute;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$base*/ 32) {
    			// This reactive statement will update all the Routes' path when
    			// the basepath changes.
    			{
    				const { path: basepath } = $base;

    				routes.update(rs => {
    					rs.forEach(r => r.path = combinePaths(basepath, r._path));
    					return rs;
    				});
    			}
    		}

    		if ($$self.$$.dirty & /*$routes, $location*/ 192) {
    			// This reactive statement will be run when the Router is created
    			// when there are no Routes and then again the following tick, so it
    			// will not find an active Route in SSR and in the browser it will only
    			// pick an active Route after all Routes have been registered.
    			{
    				const bestMatch = pick($routes, $location.pathname);
    				activeRoute.set(bestMatch);
    			}
    		}
    	};

    	return [
    		routes,
    		location,
    		base,
    		basepath,
    		url,
    		$base,
    		$location,
    		$routes,
    		$$scope,
    		slots
    	];
    }

    class Router extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { basepath: 3, url: 4 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Router",
    			options,
    			id: create_fragment.name
    		});
    	}

    	get basepath() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set basepath(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get url() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set url(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-routing/src/Route.svelte generated by Svelte v3.32.3 */

    const get_default_slot_changes = dirty => ({
    	params: dirty & /*routeParams*/ 4,
    	location: dirty & /*$location*/ 16
    });

    const get_default_slot_context = ctx => ({
    	params: /*routeParams*/ ctx[2],
    	location: /*$location*/ ctx[4]
    });

    // (40:0) {#if $activeRoute !== null && $activeRoute.route === route}
    function create_if_block(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_1, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*component*/ ctx[0] !== null) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(40:0) {#if $activeRoute !== null && $activeRoute.route === route}",
    		ctx
    	});

    	return block;
    }

    // (43:2) {:else}
    function create_else_block(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[10].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[9], get_default_slot_context);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope, routeParams, $location*/ 532) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[9], dirty, get_default_slot_changes, get_default_slot_context);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(43:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (41:2) {#if component !== null}
    function create_if_block_1(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;

    	const switch_instance_spread_levels = [
    		{ location: /*$location*/ ctx[4] },
    		/*routeParams*/ ctx[2],
    		/*routeProps*/ ctx[3]
    	];

    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*$location, routeParams, routeProps*/ 28)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty & /*$location*/ 16 && { location: /*$location*/ ctx[4] },
    					dirty & /*routeParams*/ 4 && get_spread_object(/*routeParams*/ ctx[2]),
    					dirty & /*routeProps*/ 8 && get_spread_object(/*routeProps*/ ctx[3])
    				])
    			: {};

    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(41:2) {#if component !== null}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*$activeRoute*/ ctx[1] !== null && /*$activeRoute*/ ctx[1].route === /*route*/ ctx[7] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*$activeRoute*/ ctx[1] !== null && /*$activeRoute*/ ctx[1].route === /*route*/ ctx[7]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*$activeRoute*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let $activeRoute;
    	let $location;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Route", slots, ['default']);
    	let { path = "" } = $$props;
    	let { component = null } = $$props;
    	const { registerRoute, unregisterRoute, activeRoute } = getContext(ROUTER);
    	validate_store(activeRoute, "activeRoute");
    	component_subscribe($$self, activeRoute, value => $$invalidate(1, $activeRoute = value));
    	const location = getContext(LOCATION);
    	validate_store(location, "location");
    	component_subscribe($$self, location, value => $$invalidate(4, $location = value));

    	const route = {
    		path,
    		// If no path prop is given, this Route will act as the default Route
    		// that is rendered if no other Route in the Router is a match.
    		default: path === ""
    	};

    	let routeParams = {};
    	let routeProps = {};
    	registerRoute(route);

    	// There is no need to unregister Routes in SSR since it will all be
    	// thrown away anyway.
    	if (typeof window !== "undefined") {
    		onDestroy(() => {
    			unregisterRoute(route);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(13, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ("path" in $$new_props) $$invalidate(8, path = $$new_props.path);
    		if ("component" in $$new_props) $$invalidate(0, component = $$new_props.component);
    		if ("$$scope" in $$new_props) $$invalidate(9, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		onDestroy,
    		ROUTER,
    		LOCATION,
    		path,
    		component,
    		registerRoute,
    		unregisterRoute,
    		activeRoute,
    		location,
    		route,
    		routeParams,
    		routeProps,
    		$activeRoute,
    		$location
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(13, $$props = assign(assign({}, $$props), $$new_props));
    		if ("path" in $$props) $$invalidate(8, path = $$new_props.path);
    		if ("component" in $$props) $$invalidate(0, component = $$new_props.component);
    		if ("routeParams" in $$props) $$invalidate(2, routeParams = $$new_props.routeParams);
    		if ("routeProps" in $$props) $$invalidate(3, routeProps = $$new_props.routeProps);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$activeRoute*/ 2) {
    			if ($activeRoute && $activeRoute.route === route) {
    				$$invalidate(2, routeParams = $activeRoute.params);
    			}
    		}

    		{
    			const { path, component, ...rest } = $$props;
    			$$invalidate(3, routeProps = rest);
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		component,
    		$activeRoute,
    		routeParams,
    		routeProps,
    		$location,
    		activeRoute,
    		location,
    		route,
    		path,
    		$$scope,
    		slots
    	];
    }

    class Route extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { path: 8, component: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Route",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get path() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set path(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get component() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set component(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-routing/src/Link.svelte generated by Svelte v3.32.3 */
    const file = "node_modules/svelte-routing/src/Link.svelte";

    function create_fragment$2(ctx) {
    	let a;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[16].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[15], null);

    	let a_levels = [
    		{ href: /*href*/ ctx[0] },
    		{ "aria-current": /*ariaCurrent*/ ctx[2] },
    		/*props*/ ctx[1],
    		/*$$restProps*/ ctx[6]
    	];

    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign(a_data, a_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			a = element("a");
    			if (default_slot) default_slot.c();
    			set_attributes(a, a_data);
    			add_location(a, file, 40, 0, 1249);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);

    			if (default_slot) {
    				default_slot.m(a, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(a, "click", /*onClick*/ ctx[5], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 32768) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[15], dirty, null, null);
    				}
    			}

    			set_attributes(a, a_data = get_spread_update(a_levels, [
    				(!current || dirty & /*href*/ 1) && { href: /*href*/ ctx[0] },
    				(!current || dirty & /*ariaCurrent*/ 4) && { "aria-current": /*ariaCurrent*/ ctx[2] },
    				dirty & /*props*/ 2 && /*props*/ ctx[1],
    				dirty & /*$$restProps*/ 64 && /*$$restProps*/ ctx[6]
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let ariaCurrent;
    	const omit_props_names = ["to","replace","state","getProps"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let $base;
    	let $location;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Link", slots, ['default']);
    	let { to = "#" } = $$props;
    	let { replace = false } = $$props;
    	let { state = {} } = $$props;
    	let { getProps = () => ({}) } = $$props;
    	const { base } = getContext(ROUTER);
    	validate_store(base, "base");
    	component_subscribe($$self, base, value => $$invalidate(13, $base = value));
    	const location = getContext(LOCATION);
    	validate_store(location, "location");
    	component_subscribe($$self, location, value => $$invalidate(14, $location = value));
    	const dispatch = createEventDispatcher();
    	let href, isPartiallyCurrent, isCurrent, props;

    	function onClick(event) {
    		dispatch("click", event);

    		if (shouldNavigate(event)) {
    			event.preventDefault();

    			// Don't push another entry to the history stack when the user
    			// clicks on a Link to the page they are currently on.
    			const shouldReplace = $location.pathname === href || replace;

    			navigate(href, { state, replace: shouldReplace });
    		}
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(6, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("to" in $$new_props) $$invalidate(7, to = $$new_props.to);
    		if ("replace" in $$new_props) $$invalidate(8, replace = $$new_props.replace);
    		if ("state" in $$new_props) $$invalidate(9, state = $$new_props.state);
    		if ("getProps" in $$new_props) $$invalidate(10, getProps = $$new_props.getProps);
    		if ("$$scope" in $$new_props) $$invalidate(15, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		createEventDispatcher,
    		ROUTER,
    		LOCATION,
    		navigate,
    		startsWith,
    		resolve,
    		shouldNavigate,
    		to,
    		replace,
    		state,
    		getProps,
    		base,
    		location,
    		dispatch,
    		href,
    		isPartiallyCurrent,
    		isCurrent,
    		props,
    		onClick,
    		$base,
    		$location,
    		ariaCurrent
    	});

    	$$self.$inject_state = $$new_props => {
    		if ("to" in $$props) $$invalidate(7, to = $$new_props.to);
    		if ("replace" in $$props) $$invalidate(8, replace = $$new_props.replace);
    		if ("state" in $$props) $$invalidate(9, state = $$new_props.state);
    		if ("getProps" in $$props) $$invalidate(10, getProps = $$new_props.getProps);
    		if ("href" in $$props) $$invalidate(0, href = $$new_props.href);
    		if ("isPartiallyCurrent" in $$props) $$invalidate(11, isPartiallyCurrent = $$new_props.isPartiallyCurrent);
    		if ("isCurrent" in $$props) $$invalidate(12, isCurrent = $$new_props.isCurrent);
    		if ("props" in $$props) $$invalidate(1, props = $$new_props.props);
    		if ("ariaCurrent" in $$props) $$invalidate(2, ariaCurrent = $$new_props.ariaCurrent);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*to, $base*/ 8320) {
    			$$invalidate(0, href = to === "/" ? $base.uri : resolve(to, $base.uri));
    		}

    		if ($$self.$$.dirty & /*$location, href*/ 16385) {
    			$$invalidate(11, isPartiallyCurrent = startsWith($location.pathname, href));
    		}

    		if ($$self.$$.dirty & /*href, $location*/ 16385) {
    			$$invalidate(12, isCurrent = href === $location.pathname);
    		}

    		if ($$self.$$.dirty & /*isCurrent*/ 4096) {
    			$$invalidate(2, ariaCurrent = isCurrent ? "page" : undefined);
    		}

    		if ($$self.$$.dirty & /*getProps, $location, href, isPartiallyCurrent, isCurrent*/ 23553) {
    			$$invalidate(1, props = getProps({
    				location: $location,
    				href,
    				isPartiallyCurrent,
    				isCurrent
    			}));
    		}
    	};

    	return [
    		href,
    		props,
    		ariaCurrent,
    		base,
    		location,
    		onClick,
    		$$restProps,
    		to,
    		replace,
    		state,
    		getProps,
    		isPartiallyCurrent,
    		isCurrent,
    		$base,
    		$location,
    		$$scope,
    		slots
    	];
    }

    class Link extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {
    			to: 7,
    			replace: 8,
    			state: 9,
    			getProps: 10
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Link",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get to() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set to(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get replace() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set replace(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get state() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set state(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getProps() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set getProps(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/Blobs.svelte generated by Svelte v3.32.3 */
    const file$1 = "src/components/Blobs.svelte";

    function create_fragment$3(ctx) {
    	let div2;
    	let div0;
    	let t;
    	let div1;

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			t = space();
    			div1 = element("div");
    			attr_dev(div0, "class", "blob svelte-dg8sis");
    			attr_dev(div0, "id", "b1");
    			set_style(div0, "background-color", /*blobColours*/ ctx[0].bc1);
    			add_location(div0, file$1, 13, 2, 241);
    			attr_dev(div1, "class", "blob svelte-dg8sis");
    			attr_dev(div1, "id", "b2");
    			set_style(div1, "background-color", /*blobColours*/ ctx[0].bc2);
    			add_location(div1, file$1, 14, 2, 317);
    			attr_dev(div2, "class", "blobs");
    			add_location(div2, file$1, 12, 0, 219);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div2, t);
    			append_dev(div2, div1);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*blobColours*/ 1) {
    				set_style(div0, "background-color", /*blobColours*/ ctx[0].bc1);
    			}

    			if (dirty & /*blobColours*/ 1) {
    				set_style(div1, "background-color", /*blobColours*/ ctx[0].bc2);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Blobs", slots, []);
    	let blobColours = { bc1: "", bc2: "" };
    	blob1.subscribe(v => $$invalidate(0, blobColours.bc1 = v, blobColours));
    	blob2.subscribe(v => $$invalidate(0, blobColours.bc2 = v, blobColours));
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Blobs> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ blob1, blob2, blobColours });

    	$$self.$inject_state = $$props => {
    		if ("blobColours" in $$props) $$invalidate(0, blobColours = $$props.blobColours);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [blobColours];
    }

    class Blobs extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Blobs",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    function cubicInOut(t) {
        return t < 0.5 ? 4.0 * t * t * t : 0.5 * Math.pow(2.0 * t - 2.0, 3.0) + 1.0;
    }

    function blur(node, { delay = 0, duration = 400, easing = cubicInOut, amount = 5, opacity = 0 } = {}) {
        const style = getComputedStyle(node);
        const target_opacity = +style.opacity;
        const f = style.filter === 'none' ? '' : style.filter;
        const od = target_opacity * (1 - opacity);
        return {
            delay,
            duration,
            easing,
            css: (_t, u) => `opacity: ${target_opacity - (od * u)}; filter: ${f} blur(${u * amount}px);`
        };
    }

    /* src/routes/Home.svelte generated by Svelte v3.32.3 */
    const file$2 = "src/routes/Home.svelte";

    // (22:6) <Link to="/getting-the-electric"         >
    function create_default_slot_5(ctx) {
    	let em;
    	let t1;

    	const block = {
    		c: function create() {
    			em = element("em");
    			em.textContent = "Getting The Electric";
    			t1 = text(" · Louise Hegarty");
    			add_location(em, file$2, 22, 9, 536);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, em, anchor);
    			insert_dev(target, t1, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(em);
    			if (detaching) detach_dev(t1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5.name,
    		type: "slot",
    		source: "(22:6) <Link to=\\\"/getting-the-electric\\\"         >",
    		ctx
    	});

    	return block;
    }

    // (27:6) <Link to="/a-scarf"         >
    function create_default_slot_4(ctx) {
    	let em;
    	let t1;

    	const block = {
    		c: function create() {
    			em = element("em");
    			em.textContent = "A Scarf";
    			t1 = text(" · Doireann Ní Ghríofa");
    			add_location(em, file$2, 27, 9, 668);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, em, anchor);
    			insert_dev(target, t1, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(em);
    			if (detaching) detach_dev(t1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4.name,
    		type: "slot",
    		source: "(27:6) <Link to=\\\"/a-scarf\\\"         >",
    		ctx
    	});

    	return block;
    }

    // (32:6) <Link to="/saint-sisters"         >
    function create_default_slot_3(ctx) {
    	let em;
    	let t1;

    	const block = {
    		c: function create() {
    			em = element("em");
    			em.textContent = "Saint Sisters And The Sea";
    			t1 = text(" · Méabh de Brún");
    			add_location(em, file$2, 32, 9, 798);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, em, anchor);
    			insert_dev(target, t1, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(em);
    			if (detaching) detach_dev(t1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(32:6) <Link to=\\\"/saint-sisters\\\"         >",
    		ctx
    	});

    	return block;
    }

    // (37:6) <Link to="/butterfly"         >
    function create_default_slot_2(ctx) {
    	let em;
    	let t1;

    	const block = {
    		c: function create() {
    			em = element("em");
    			em.textContent = "Butterfly";
    			t1 = text(" · Colm O'Shea");
    			add_location(em, file$2, 37, 9, 936);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, em, anchor);
    			insert_dev(target, t1, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(em);
    			if (detaching) detach_dev(t1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(37:6) <Link to=\\\"/butterfly\\\"         >",
    		ctx
    	});

    	return block;
    }

    // (42:6) <Link to="/only-just"         >
    function create_default_slot_1(ctx) {
    	let em0;
    	let t1;
    	let em1;
    	let t3;

    	const block = {
    		c: function create() {
    			em0 = element("em");
    			em0.textContent = "I Know, But Only Just";
    			t1 = text(" · Ruby Wallis\n        ");
    			em1 = element("em");
    			em1.textContent = "&";
    			t3 = text(" Claire-Louise Bennett");
    			add_location(em0, file$2, 42, 9, 1056);
    			add_location(em1, file$2, 43, 8, 1126);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, em0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, em1, anchor);
    			insert_dev(target, t3, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(em0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(em1);
    			if (detaching) detach_dev(t3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(42:6) <Link to=\\\"/only-just\\\"         >",
    		ctx
    	});

    	return block;
    }

    // (48:6) <Link to="/the-conjuring"         >
    function create_default_slot(ctx) {
    	let em0;
    	let t1;
    	let em1;
    	let t3;

    	const block = {
    		c: function create() {
    			em0 = element("em");
    			em0.textContent = "The Conjuring / Dubh Sainglend to Liath Macha, on Cú Chulainn’s Death";
    			t1 = text("\n        · Nidhi Zak/Aria Eipe ");
    			em1 = element("em");
    			em1.textContent = "&";
    			t3 = text(" Michael Dooley");
    			add_location(em0, file$2, 48, 9, 1233);
    			add_location(em1, file$2, 51, 36, 1368);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, em0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, em1, anchor);
    			insert_dev(target, t3, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(em0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(em1);
    			if (detaching) detach_dev(t3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(48:6) <Link to=\\\"/the-conjuring\\\"         >",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let nav;
    	let ul;
    	let li0;
    	let link0;
    	let t0;
    	let li1;
    	let link1;
    	let t1;
    	let li2;
    	let link2;
    	let t2;
    	let li3;
    	let link3;
    	let t3;
    	let li4;
    	let link4;
    	let t4;
    	let li5;
    	let link5;
    	let nav_intro;
    	let nav_outro;
    	let current;

    	link0 = new Link({
    			props: {
    				to: "/getting-the-electric",
    				$$slots: { default: [create_default_slot_5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link1 = new Link({
    			props: {
    				to: "/a-scarf",
    				$$slots: { default: [create_default_slot_4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link2 = new Link({
    			props: {
    				to: "/saint-sisters",
    				$$slots: { default: [create_default_slot_3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link3 = new Link({
    			props: {
    				to: "/butterfly",
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link4 = new Link({
    			props: {
    				to: "/only-just",
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link5 = new Link({
    			props: {
    				to: "/the-conjuring",
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			nav = element("nav");
    			ul = element("ul");
    			li0 = element("li");
    			create_component(link0.$$.fragment);
    			t0 = space();
    			li1 = element("li");
    			create_component(link1.$$.fragment);
    			t1 = space();
    			li2 = element("li");
    			create_component(link2.$$.fragment);
    			t2 = space();
    			li3 = element("li");
    			create_component(link3.$$.fragment);
    			t3 = space();
    			li4 = element("li");
    			create_component(link4.$$.fragment);
    			t4 = space();
    			li5 = element("li");
    			create_component(link5.$$.fragment);
    			attr_dev(li0, "class", "svelte-stn5eg");
    			add_location(li0, file$2, 20, 4, 483);
    			attr_dev(li1, "class", "svelte-stn5eg");
    			add_location(li1, file$2, 25, 4, 628);
    			attr_dev(li2, "class", "svelte-stn5eg");
    			add_location(li2, file$2, 30, 4, 752);
    			attr_dev(li3, "class", "svelte-stn5eg");
    			add_location(li3, file$2, 35, 4, 894);
    			attr_dev(li4, "class", "svelte-stn5eg");
    			add_location(li4, file$2, 40, 4, 1014);
    			attr_dev(li5, "class", "svelte-stn5eg");
    			add_location(li5, file$2, 46, 4, 1187);
    			attr_dev(ul, "id", "toc");
    			attr_dev(ul, "class", "svelte-stn5eg");
    			add_location(ul, file$2, 19, 2, 465);
    			attr_dev(nav, "id", "home-nav");
    			attr_dev(nav, "class", "svelte-stn5eg");
    			add_location(nav, file$2, 14, 0, 301);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, nav, anchor);
    			append_dev(nav, ul);
    			append_dev(ul, li0);
    			mount_component(link0, li0, null);
    			append_dev(ul, t0);
    			append_dev(ul, li1);
    			mount_component(link1, li1, null);
    			append_dev(ul, t1);
    			append_dev(ul, li2);
    			mount_component(link2, li2, null);
    			append_dev(ul, t2);
    			append_dev(ul, li3);
    			mount_component(link3, li3, null);
    			append_dev(ul, t3);
    			append_dev(ul, li4);
    			mount_component(link4, li4, null);
    			append_dev(ul, t4);
    			append_dev(ul, li5);
    			mount_component(link5, li5, null);
    			current = true;
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			const link0_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				link0_changes.$$scope = { dirty, ctx };
    			}

    			link0.$set(link0_changes);
    			const link1_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				link1_changes.$$scope = { dirty, ctx };
    			}

    			link1.$set(link1_changes);
    			const link2_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				link2_changes.$$scope = { dirty, ctx };
    			}

    			link2.$set(link2_changes);
    			const link3_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				link3_changes.$$scope = { dirty, ctx };
    			}

    			link3.$set(link3_changes);
    			const link4_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				link4_changes.$$scope = { dirty, ctx };
    			}

    			link4.$set(link4_changes);
    			const link5_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				link5_changes.$$scope = { dirty, ctx };
    			}

    			link5.$set(link5_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link0.$$.fragment, local);
    			transition_in(link1.$$.fragment, local);
    			transition_in(link2.$$.fragment, local);
    			transition_in(link3.$$.fragment, local);
    			transition_in(link4.$$.fragment, local);
    			transition_in(link5.$$.fragment, local);

    			add_render_callback(() => {
    				if (nav_outro) nav_outro.end(1);

    				if (!nav_intro) nav_intro = create_in_transition(nav, blur, {
    					delay: 100,
    					duration: 800,
    					amount: 10,
    					easing: identity
    				});

    				nav_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link0.$$.fragment, local);
    			transition_out(link1.$$.fragment, local);
    			transition_out(link2.$$.fragment, local);
    			transition_out(link3.$$.fragment, local);
    			transition_out(link4.$$.fragment, local);
    			transition_out(link5.$$.fragment, local);
    			if (nav_intro) nav_intro.invalidate();

    			nav_outro = create_out_transition(nav, blur, {
    				delay: 0,
    				duration: 600,
    				amount: 10,
    				easing: identity
    			});

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(nav);
    			destroy_component(link0);
    			destroy_component(link1);
    			destroy_component(link2);
    			destroy_component(link3);
    			destroy_component(link4);
    			destroy_component(link5);
    			if (detaching && nav_outro) nav_outro.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Home", slots, []);

    	onMount(() => {
    		themeColour.update(theme => "#e4d4c5");
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Home> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Link, blur, linear: identity, onMount, themeColour });
    	return [];
    }

    class Home extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Home",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src/components/ArticleHeader.svelte generated by Svelte v3.32.3 */
    const file$3 = "src/components/ArticleHeader.svelte";

    // (13:2) {#if !page}
    function create_if_block$1(ctx) {
    	let div;
    	let button0;
    	let t1;
    	let button1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			button0 = element("button");
    			button0.textContent = "Listen";
    			t1 = space();
    			button1 = element("button");
    			button1.textContent = "Print";
    			attr_dev(button0, "class", "svelte-1u8wdqd");
    			add_location(button0, file$3, 14, 6, 392);
    			attr_dev(button1, "class", "svelte-1u8wdqd");
    			add_location(button1, file$3, 15, 6, 468);
    			attr_dev(div, "class", "text-options svelte-1u8wdqd");
    			add_location(div, file$3, 13, 4, 359);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, button0);
    			append_dev(div, t1);
    			append_dev(div, button1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*click_handler*/ ctx[4], false, false, false),
    					listen_dev(button1, "click", /*click_handler_1*/ ctx[5], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(13:2) {#if !page}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let header;
    	let h1;
    	let t0;
    	let t1;
    	let h2;
    	let t2;
    	let t3;
    	let header_intro;
    	let header_outro;
    	let current;
    	let if_block = !/*page*/ ctx[3] && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			header = element("header");
    			h1 = element("h1");
    			t0 = text(/*title*/ ctx[1]);
    			t1 = space();
    			h2 = element("h2");
    			t2 = text(/*author*/ ctx[2]);
    			t3 = space();
    			if (if_block) if_block.c();
    			attr_dev(h1, "class", "svelte-1u8wdqd");
    			add_location(h1, file$3, 10, 2, 304);
    			attr_dev(h2, "class", "svelte-1u8wdqd");
    			add_location(h2, file$3, 11, 2, 323);
    			attr_dev(header, "class", "svelte-1u8wdqd");
    			add_location(header, file$3, 6, 0, 153);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, header, anchor);
    			append_dev(header, h1);
    			append_dev(h1, t0);
    			append_dev(header, t1);
    			append_dev(header, h2);
    			append_dev(h2, t2);
    			append_dev(header, t3);
    			if (if_block) if_block.m(header, null);
    			current = true;
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			if (!current || dirty & /*title*/ 2) set_data_dev(t0, /*title*/ ctx[1]);
    			if (!current || dirty & /*author*/ 4) set_data_dev(t2, /*author*/ ctx[2]);

    			if (!/*page*/ ctx[3]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					if_block.m(header, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (header_outro) header_outro.end(1);

    				if (!header_intro) header_intro = create_in_transition(header, blur, {
    					delay: 100,
    					duration: 800,
    					amount: 10,
    					easing: identity
    				});

    				header_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (header_intro) header_intro.invalidate();

    			header_outro = create_out_transition(header, blur, {
    				delay: 0,
    				duration: 600,
    				amount: 10,
    				easing: identity
    			});

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(header);
    			if (if_block) if_block.d();
    			if (detaching && header_outro) header_outro.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("ArticleHeader", slots, []);

    	let { audioActive } = $$props,
    		{ title } = $$props,
    		{ author } = $$props,
    		{ page } = $$props;

    	const writable_props = ["audioActive", "title", "author", "page"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<ArticleHeader> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => $$invalidate(0, audioActive = !audioActive);
    	const click_handler_1 = () => window.print();

    	$$self.$$set = $$props => {
    		if ("audioActive" in $$props) $$invalidate(0, audioActive = $$props.audioActive);
    		if ("title" in $$props) $$invalidate(1, title = $$props.title);
    		if ("author" in $$props) $$invalidate(2, author = $$props.author);
    		if ("page" in $$props) $$invalidate(3, page = $$props.page);
    	};

    	$$self.$capture_state = () => ({
    		audioActive,
    		title,
    		author,
    		page,
    		blur,
    		linear: identity
    	});

    	$$self.$inject_state = $$props => {
    		if ("audioActive" in $$props) $$invalidate(0, audioActive = $$props.audioActive);
    		if ("title" in $$props) $$invalidate(1, title = $$props.title);
    		if ("author" in $$props) $$invalidate(2, author = $$props.author);
    		if ("page" in $$props) $$invalidate(3, page = $$props.page);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [audioActive, title, author, page, click_handler, click_handler_1];
    }

    class ArticleHeader extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {
    			audioActive: 0,
    			title: 1,
    			author: 2,
    			page: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ArticleHeader",
    			options,
    			id: create_fragment$5.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*audioActive*/ ctx[0] === undefined && !("audioActive" in props)) {
    			console.warn("<ArticleHeader> was created without expected prop 'audioActive'");
    		}

    		if (/*title*/ ctx[1] === undefined && !("title" in props)) {
    			console.warn("<ArticleHeader> was created without expected prop 'title'");
    		}

    		if (/*author*/ ctx[2] === undefined && !("author" in props)) {
    			console.warn("<ArticleHeader> was created without expected prop 'author'");
    		}

    		if (/*page*/ ctx[3] === undefined && !("page" in props)) {
    			console.warn("<ArticleHeader> was created without expected prop 'page'");
    		}
    	}

    	get audioActive() {
    		throw new Error("<ArticleHeader>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set audioActive(value) {
    		throw new Error("<ArticleHeader>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<ArticleHeader>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<ArticleHeader>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get author() {
    		throw new Error("<ArticleHeader>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set author(value) {
    		throw new Error("<ArticleHeader>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get page() {
    		throw new Error("<ArticleHeader>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set page(value) {
    		throw new Error("<ArticleHeader>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/routes/About.svelte generated by Svelte v3.32.3 */
    const file$4 = "src/routes/About.svelte";

    function create_fragment$6(ctx) {
    	let articleheader;
    	let t0;
    	let div;
    	let p0;
    	let t2;
    	let p1;
    	let em0;
    	let t4;
    	let a0;
    	let t6;
    	let a1;
    	let t8;
    	let a2;
    	let t10;
    	let a3;
    	let t12;
    	let a4;
    	let t14;
    	let a5;
    	let t16;
    	let em1;
    	let t18;
    	let t19;
    	let p2;
    	let t20;
    	let em2;
    	let t22;
    	let t23;
    	let p3;
    	let t24;
    	let em3;
    	let t26;
    	let t27;
    	let p4;
    	let em4;
    	let t29;
    	let t30;
    	let p5;
    	let t32;
    	let h3;
    	let t34;
    	let p6;
    	let div_intro;
    	let div_outro;
    	let current;

    	articleheader = new ArticleHeader({
    			props: {
    				title: "View Source",
    				author: "Wednesday March 17 2021: Solas Nua’s Irish Book Day",
    				page: true
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(articleheader.$$.fragment);
    			t0 = space();
    			div = element("div");
    			p0 = element("p");
    			p0.textContent = "Expanding on our long tradition of providing Washington D.C. with free Irish\n    books on St. Patrick’s Day, this year Solas Nua is staying green and\n    producing another digital offering - online and available anywhere in the\n    world to view on-screen, print-at-home, or even kick back and listen to.";
    			t2 = space();
    			p1 = element("p");
    			em0 = element("em");
    			em0.textContent = "View Source";
    			t4 = text(" is a unique online publication, curated by Fallow Media\n    and commissioned by Solas Nua for this year’s St. Patrick’s Day, celebrating\n    contemporary Irish literature at its most adventurous. Working alongside six\n    cutting-edge literary publications in Ireland today –\n    ");
    			a0 = element("a");
    			a0.textContent = "The Stinging Fly";
    			t6 = text(",\n    ");
    			a1 = element("a");
    			a1.textContent = "The Dublin Review";
    			t8 = text(",\n    ");
    			a2 = element("a");
    			a2.textContent = "Gorse";
    			t10 = text(",\n    ");
    			a3 = element("a");
    			a3.textContent = "Banshee";
    			t12 = text(",\n    ");
    			a4 = element("a");
    			a4.textContent = "Winter Papers";
    			t14 = text(", and\n    ");
    			a5 = element("a");
    			a5.textContent = "Fallow Media";
    			t16 = text(" –\n    ");
    			em1 = element("em");
    			em1.textContent = "View Source";
    			t18 = text("\n    has invited writers and artists to reimagine stories, poems, and essays first\n    made available in print.");
    			t19 = space();
    			p2 = element("p");
    			t20 = text("Taking advantage of the many possibilities of publishing on the internet,\n    ");
    			em2 = element("em");
    			em2.textContent = "View Source";
    			t22 = text(" presents each text in multiple ways, giving visitors the\n    opportunity to choose how they want to experience each piece through unique on-screen\n    design, creative audio, or a print-at-home publication.");
    			t23 = space();
    			p3 = element("p");
    			t24 = text("The temporary loss of bookstores and literary gatherings is just one of the\n    many changes wrought by the Covid-19 pandemic. ");
    			em3 = element("em");
    			em3.textContent = "View Source";
    			t26 = text(" uses this\n    moment of confusion and crisis to ask what opportunities might lie hidden within\n    our global shift to online spaces. By publishing this work digitally, contemporary\n    Irish literature becomes accessible in new ways to new audiences, reaching people\n    who might never otherwise have access to it. So what could a book, a journal,\n    a story look like online? How might we use the specific strengths of the internet\n    to expand the literary text and break down the borders between different media?\n    Most importantly, how might readers discover new and meaningful connections to\n    this work?");
    			t27 = space();
    			p4 = element("p");
    			em4 = element("em");
    			em4.textContent = "View Source";
    			t29 = text(" brings together the talents of many contemporary Irish writers\n    and artists, including: Claire-Louise Bennett, Ruby Wallis, Doireann Ní Ghríofa,\n    Colm O'Shea, Méabh de Brún, Nidhi Zak/Aria Eipe, Michael Dooley, Tom Rosingrave,\n    Maija Sofia, Vicky Langan and Louise Hegarty. Throughout the publication, the\n    finest writing blends with inventive audio and visual work to create a truly\n    special literary experience.");
    			t30 = space();
    			p5 = element("p");
    			p5.textContent = "Kindly supported by Dennis Houlihan and Mimi Conway.";
    			t32 = space();
    			h3 = element("h3");
    			h3.textContent = "About Fallow Media";
    			t34 = space();
    			p6 = element("p");
    			p6.textContent = "With the belief that the internet offers us critical and conceptual\n    approaches that remain largely unexplored in the worlds of literature, music\n    and the arts, Fallow Media has become an alternative space for contemporary\n    creativity in Ireland. Each project is a learning process, and an attempt to\n    share work from across the artistic spectrum in a new way. The hope is not\n    only to change the way people see this work, but also the way work is\n    created in the first place.";
    			add_location(p0, file$4, 24, 2, 606);
    			add_location(em0, file$4, 32, 4, 937);
    			attr_dev(a0, "href", "https://stingingfly.org/");
    			attr_dev(a0, "class", "svelte-rte5hp");
    			add_location(a0, file$4, 36, 4, 1238);
    			attr_dev(a1, "href", "https://thedublinreview.com/");
    			attr_dev(a1, "class", "svelte-rte5hp");
    			add_location(a1, file$4, 37, 4, 1299);
    			attr_dev(a2, "href", "http://gorse.ie/");
    			attr_dev(a2, "class", "svelte-rte5hp");
    			add_location(a2, file$4, 38, 4, 1365);
    			attr_dev(a3, "href", "https://www.bansheelit.com/");
    			attr_dev(a3, "class", "svelte-rte5hp");
    			add_location(a3, file$4, 39, 4, 1407);
    			attr_dev(a4, "href", "https://winterpapers.com/");
    			attr_dev(a4, "class", "svelte-rte5hp");
    			add_location(a4, file$4, 40, 4, 1462);
    			attr_dev(a5, "href", "https://fallowmedia.com/");
    			attr_dev(a5, "class", "svelte-rte5hp");
    			add_location(a5, file$4, 41, 4, 1525);
    			add_location(em1, file$4, 42, 4, 1583);
    			add_location(p1, file$4, 31, 2, 929);
    			add_location(em2, file$4, 49, 4, 1811);
    			add_location(p2, file$4, 47, 2, 1725);
    			add_location(em3, file$4, 56, 51, 2184);
    			add_location(p3, file$4, 54, 2, 2049);
    			add_location(em4, file$4, 68, 4, 2841);
    			add_location(p4, file$4, 67, 2, 2833);
    			add_location(p5, file$4, 75, 2, 3300);
    			add_location(h3, file$4, 76, 2, 3362);
    			add_location(p6, file$4, 77, 2, 3392);
    			attr_dev(div, "class", "text");
    			add_location(div, file$4, 19, 0, 443);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(articleheader, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div, anchor);
    			append_dev(div, p0);
    			append_dev(div, t2);
    			append_dev(div, p1);
    			append_dev(p1, em0);
    			append_dev(p1, t4);
    			append_dev(p1, a0);
    			append_dev(p1, t6);
    			append_dev(p1, a1);
    			append_dev(p1, t8);
    			append_dev(p1, a2);
    			append_dev(p1, t10);
    			append_dev(p1, a3);
    			append_dev(p1, t12);
    			append_dev(p1, a4);
    			append_dev(p1, t14);
    			append_dev(p1, a5);
    			append_dev(p1, t16);
    			append_dev(p1, em1);
    			append_dev(p1, t18);
    			append_dev(div, t19);
    			append_dev(div, p2);
    			append_dev(p2, t20);
    			append_dev(p2, em2);
    			append_dev(p2, t22);
    			append_dev(div, t23);
    			append_dev(div, p3);
    			append_dev(p3, t24);
    			append_dev(p3, em3);
    			append_dev(p3, t26);
    			append_dev(div, t27);
    			append_dev(div, p4);
    			append_dev(p4, em4);
    			append_dev(p4, t29);
    			append_dev(div, t30);
    			append_dev(div, p5);
    			append_dev(div, t32);
    			append_dev(div, h3);
    			append_dev(div, t34);
    			append_dev(div, p6);
    			current = true;
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(articleheader.$$.fragment, local);

    			add_render_callback(() => {
    				if (div_outro) div_outro.end(1);

    				if (!div_intro) div_intro = create_in_transition(div, blur, {
    					delay: 100,
    					duration: 800,
    					amount: 10,
    					easing: identity
    				});

    				div_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(articleheader.$$.fragment, local);
    			if (div_intro) div_intro.invalidate();

    			div_outro = create_out_transition(div, blur, {
    				delay: 0,
    				duration: 600,
    				amount: 10,
    				easing: identity
    			});

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(articleheader, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div);
    			if (detaching && div_outro) div_outro.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("About", slots, []);

    	onMount(() => {
    		themeColour.update(theme => "#e4d4c5");
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<About> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		blur,
    		linear: identity,
    		ArticleHeader,
    		onMount,
    		themeColour
    	});

    	return [];
    }

    class About extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "About",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    // Should really do this with translation, not position.
    const move = (el) => {
    	let x = Math.floor(Math.random() * 100);
    	let y = Math.floor(Math.random() * 100);
    	el.style.left = `${x}vw`;
    	el.style.top = `${y}vh`;
    };

    /* src/components/Progress.svelte generated by Svelte v3.32.3 */
    const file$5 = "src/components/Progress.svelte";

    function create_fragment$7(ctx) {
    	let div1;
    	let div0;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			attr_dev(div0, "class", "slider svelte-hbri4l");
    			attr_dev(div0, "width", /*elapsed*/ ctx[0]);
    			add_location(div0, file$5, 20, 2, 454);
    			attr_dev(div1, "class", "progress svelte-hbri4l");
    			add_location(div1, file$5, 19, 0, 413);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);

    			if (!mounted) {
    				dispose = listen_dev(div1, "click", /*seek*/ ctx[1], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*elapsed*/ 1) {
    				attr_dev(div0, "width", /*elapsed*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Progress", slots, []);
    	let { elapsed } = $$props, { audioElement } = $$props;

    	const seek = e => {
    		let o = e.offsetX;
    		let w = e.target.getBoundingClientRect().width;
    		let px = o / w;
    		let d = audioElement.duration;
    		let s = d * px;
    		$$invalidate(2, audioElement.currentTime = s, audioElement);
    	};

    	afterUpdate(() => {
    		document.querySelector(".slider").style.width = `${elapsed * 100}%`;
    	});

    	const writable_props = ["elapsed", "audioElement"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Progress> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("elapsed" in $$props) $$invalidate(0, elapsed = $$props.elapsed);
    		if ("audioElement" in $$props) $$invalidate(2, audioElement = $$props.audioElement);
    	};

    	$$self.$capture_state = () => ({ afterUpdate, elapsed, audioElement, seek });

    	$$self.$inject_state = $$props => {
    		if ("elapsed" in $$props) $$invalidate(0, elapsed = $$props.elapsed);
    		if ("audioElement" in $$props) $$invalidate(2, audioElement = $$props.audioElement);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [elapsed, seek, audioElement];
    }

    class Progress extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, { elapsed: 0, audioElement: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Progress",
    			options,
    			id: create_fragment$7.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*elapsed*/ ctx[0] === undefined && !("elapsed" in props)) {
    			console.warn("<Progress> was created without expected prop 'elapsed'");
    		}

    		if (/*audioElement*/ ctx[2] === undefined && !("audioElement" in props)) {
    			console.warn("<Progress> was created without expected prop 'audioElement'");
    		}
    	}

    	get elapsed() {
    		throw new Error("<Progress>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set elapsed(value) {
    		throw new Error("<Progress>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get audioElement() {
    		throw new Error("<Progress>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set audioElement(value) {
    		throw new Error("<Progress>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/PlayPause.svelte generated by Svelte v3.32.3 */

    const file$6 = "src/components/PlayPause.svelte";

    function create_fragment$8(ctx) {
    	let svg;
    	let path0;
    	let path1;
    	let g;
    	let path2;
    	let svg_class_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			g = svg_element("g");
    			path2 = svg_element("path");
    			attr_dev(path0, "d", "M341 5a334.1 334.1 0 01237.6 98.4A334.4 334.4 0 01677 341a334.1 334.1 0 01-98.4 237.6A334.4 334.4 0 01341 677a334.1 334.1 0 01-237.6-98.4A334.4 334.4 0 015 341a334.1 334.1 0 0198.4-237.6A334.4 334.4 0 01341 5m0-5a341 341 0 100 682 341 341 0 000-682z");
    			attr_dev(path0, "id", "circle");
    			attr_dev(path0, "class", "svelte-1dcmz80");
    			add_location(path0, file$6, 24, 2, 392);
    			attr_dev(path1, "id", "play");
    			attr_dev(path1, "d", "M199.4 132.2l190.6 110 170.6 98.6v.4L370 451.2l-170.6 98.6-.4.2V133");
    			attr_dev(path1, "class", "svelte-1dcmz80");
    			add_location(path1, file$6, 28, 2, 679);
    			attr_dev(path2, "d", "M199 132h132v418H199zM351 132h132v418H351z");
    			add_location(path2, file$6, 33, 4, 801);
    			attr_dev(g, "id", "pause");
    			attr_dev(g, "class", "svelte-1dcmz80");
    			add_location(g, file$6, 32, 2, 782);
    			attr_dev(svg, "version", "1.1");
    			attr_dev(svg, "id", "playpause");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "x", "0");
    			attr_dev(svg, "y", "0");
    			attr_dev(svg, "viewBox", "-50 -50 782 782");
    			attr_dev(svg, "xml:space", "preserve");
    			attr_dev(svg, "class", svg_class_value = "" + (null_to_empty(/*paused*/ ctx[0] ? "paused" : "") + " svelte-1dcmz80"));
    			add_location(svg, file$6, 13, 0, 189);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path0);
    			append_dev(svg, path1);
    			append_dev(svg, g);
    			append_dev(g, path2);

    			if (!mounted) {
    				dispose = listen_dev(svg, "click", /*handlePlay*/ ctx[1], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*paused*/ 1 && svg_class_value !== (svg_class_value = "" + (null_to_empty(/*paused*/ ctx[0] ? "paused" : "") + " svelte-1dcmz80"))) {
    				attr_dev(svg, "class", svg_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("PlayPause", slots, []);
    	let { paused } = $$props, { audioElement } = $$props;

    	const handlePlay = e => {
    		let t = audioElement;

    		if (t.paused) {
    			t.play();
    		} else {
    			t.pause();
    		}
    	};

    	const writable_props = ["paused", "audioElement"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<PlayPause> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("paused" in $$props) $$invalidate(0, paused = $$props.paused);
    		if ("audioElement" in $$props) $$invalidate(2, audioElement = $$props.audioElement);
    	};

    	$$self.$capture_state = () => ({ paused, audioElement, handlePlay });

    	$$self.$inject_state = $$props => {
    		if ("paused" in $$props) $$invalidate(0, paused = $$props.paused);
    		if ("audioElement" in $$props) $$invalidate(2, audioElement = $$props.audioElement);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [paused, handlePlay, audioElement];
    }

    class PlayPause extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, { paused: 0, audioElement: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PlayPause",
    			options,
    			id: create_fragment$8.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*paused*/ ctx[0] === undefined && !("paused" in props)) {
    			console.warn("<PlayPause> was created without expected prop 'paused'");
    		}

    		if (/*audioElement*/ ctx[2] === undefined && !("audioElement" in props)) {
    			console.warn("<PlayPause> was created without expected prop 'audioElement'");
    		}
    	}

    	get paused() {
    		throw new Error("<PlayPause>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set paused(value) {
    		throw new Error("<PlayPause>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get audioElement() {
    		throw new Error("<PlayPause>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set audioElement(value) {
    		throw new Error("<PlayPause>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/AudioPlayer.svelte generated by Svelte v3.32.3 */
    const file$7 = "src/components/AudioPlayer.svelte";

    // (37:4) {#if credits}
    function create_if_block$2(ctx) {
    	let span;
    	let t;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(/*credits*/ ctx[2]);
    			attr_dev(span, "class", "credits svelte-1alf4ij");
    			add_location(span, file$7, 37, 6, 833);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*credits*/ 4) set_data_dev(t, /*credits*/ ctx[2]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(37:4) {#if credits}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let div2;
    	let audio;
    	let audio_src_value;
    	let audio_updating = false;
    	let audio_animationframe;
    	let audio_is_paused = true;
    	let t0;
    	let div1;
    	let playpause;
    	let t1;
    	let t2;
    	let div0;
    	let span0;

    	let t3_value = (/*currentTime*/ ctx[4]
    	? /*formatTime*/ ctx[7](/*currentTime*/ ctx[4])
    	: "00:00") + "";

    	let t3;
    	let t4;
    	let progress;
    	let t5;
    	let span1;
    	let t6_value = /*formatTime*/ ctx[7](/*duration*/ ctx[5]) + "";
    	let t6;
    	let current;
    	let mounted;
    	let dispose;

    	function audio_timeupdate_handler() {
    		cancelAnimationFrame(audio_animationframe);

    		if (!audio.paused) {
    			audio_animationframe = raf(audio_timeupdate_handler);
    			audio_updating = true;
    		}

    		/*audio_timeupdate_handler*/ ctx[9].call(audio);
    	}

    	playpause = new PlayPause({
    			props: {
    				paused: /*paused*/ ctx[6],
    				audioElement: /*audioElement*/ ctx[3]
    			},
    			$$inline: true
    		});

    	let if_block = /*credits*/ ctx[2] && create_if_block$2(ctx);

    	progress = new Progress({
    			props: {
    				elapsed: /*currentTime*/ ctx[4]
    				? /*currentTime*/ ctx[4] / /*duration*/ ctx[5]
    				: 0,
    				audioElement: /*audioElement*/ ctx[3]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			audio = element("audio");
    			t0 = space();
    			div1 = element("div");
    			create_component(playpause.$$.fragment);
    			t1 = space();
    			if (if_block) if_block.c();
    			t2 = space();
    			div0 = element("div");
    			span0 = element("span");
    			t3 = text(t3_value);
    			t4 = space();
    			create_component(progress.$$.fragment);
    			t5 = space();
    			span1 = element("span");
    			t6 = text(t6_value);
    			attr_dev(audio, "id", "a");
    			if (audio.src !== (audio_src_value = /*src*/ ctx[0])) attr_dev(audio, "src", audio_src_value);
    			if (/*duration*/ ctx[5] === void 0) add_render_callback(() => /*audio_durationchange_handler*/ ctx[8].call(audio));
    			add_location(audio, file$7, 26, 2, 625);
    			attr_dev(span0, "class", "elapsed");
    			add_location(span0, file$7, 40, 6, 916);
    			attr_dev(span1, "class", "duration");
    			add_location(span1, file$7, 47, 6, 1124);
    			attr_dev(div0, "class", "audiotime svelte-1alf4ij");
    			add_location(div0, file$7, 39, 4, 886);
    			attr_dev(div1, "class", "controls svelte-1alf4ij");
    			add_location(div1, file$7, 34, 2, 744);
    			attr_dev(div2, "id", "audioPlayer");
    			attr_dev(div2, "class", "svelte-1alf4ij");
    			toggle_class(div2, "active", /*active*/ ctx[1]);
    			add_location(div2, file$7, 24, 0, 539);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, audio);
    			/*audio_binding*/ ctx[11](audio);
    			append_dev(div2, t0);
    			append_dev(div2, div1);
    			mount_component(playpause, div1, null);
    			append_dev(div1, t1);
    			if (if_block) if_block.m(div1, null);
    			append_dev(div1, t2);
    			append_dev(div1, div0);
    			append_dev(div0, span0);
    			append_dev(span0, t3);
    			append_dev(div0, t4);
    			mount_component(progress, div0, null);
    			append_dev(div0, t5);
    			append_dev(div0, span1);
    			append_dev(span1, t6);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(audio, "durationchange", /*audio_durationchange_handler*/ ctx[8]),
    					listen_dev(audio, "timeupdate", audio_timeupdate_handler),
    					listen_dev(audio, "play", /*audio_play_pause_handler*/ ctx[10]),
    					listen_dev(audio, "pause", /*audio_play_pause_handler*/ ctx[10])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*src*/ 1 && audio.src !== (audio_src_value = /*src*/ ctx[0])) {
    				attr_dev(audio, "src", audio_src_value);
    			}

    			if (!audio_updating && dirty & /*currentTime*/ 16 && !isNaN(/*currentTime*/ ctx[4])) {
    				audio.currentTime = /*currentTime*/ ctx[4];
    			}

    			audio_updating = false;

    			if (dirty & /*paused*/ 64 && audio_is_paused !== (audio_is_paused = /*paused*/ ctx[6])) {
    				audio[audio_is_paused ? "pause" : "play"]();
    			}

    			const playpause_changes = {};
    			if (dirty & /*paused*/ 64) playpause_changes.paused = /*paused*/ ctx[6];
    			if (dirty & /*audioElement*/ 8) playpause_changes.audioElement = /*audioElement*/ ctx[3];
    			playpause.$set(playpause_changes);

    			if (/*credits*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$2(ctx);
    					if_block.c();
    					if_block.m(div1, t2);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if ((!current || dirty & /*currentTime*/ 16) && t3_value !== (t3_value = (/*currentTime*/ ctx[4]
    			? /*formatTime*/ ctx[7](/*currentTime*/ ctx[4])
    			: "00:00") + "")) set_data_dev(t3, t3_value);

    			const progress_changes = {};

    			if (dirty & /*currentTime, duration*/ 48) progress_changes.elapsed = /*currentTime*/ ctx[4]
    			? /*currentTime*/ ctx[4] / /*duration*/ ctx[5]
    			: 0;

    			if (dirty & /*audioElement*/ 8) progress_changes.audioElement = /*audioElement*/ ctx[3];
    			progress.$set(progress_changes);
    			if ((!current || dirty & /*duration*/ 32) && t6_value !== (t6_value = /*formatTime*/ ctx[7](/*duration*/ ctx[5]) + "")) set_data_dev(t6, t6_value);

    			if (dirty & /*active*/ 2) {
    				toggle_class(div2, "active", /*active*/ ctx[1]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(playpause.$$.fragment, local);
    			transition_in(progress.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(playpause.$$.fragment, local);
    			transition_out(progress.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			/*audio_binding*/ ctx[11](null);
    			destroy_component(playpause);
    			if (if_block) if_block.d();
    			destroy_component(progress);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("AudioPlayer", slots, []);
    	let { src } = $$props, { active } = $$props, { credits } = $$props;
    	let audioElement, currentTime, duration, paused = true;

    	const formatTime = time => {
    		function pad(n, width, z) {
    			z = z || "0";
    			n = n + "";

    			return n.length >= width
    			? n
    			: new Array(width - n.length + 1).join(z) + n;
    		}

    		let mm = pad(parseInt(time / 60), 2);
    		let ss = pad(parseInt(time % 60), 2);
    		return `${mm}:${ss}`;
    	};

    	const writable_props = ["src", "active", "credits"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<AudioPlayer> was created with unknown prop '${key}'`);
    	});

    	function audio_durationchange_handler() {
    		duration = this.duration;
    		$$invalidate(5, duration);
    	}

    	function audio_timeupdate_handler() {
    		currentTime = this.currentTime;
    		$$invalidate(4, currentTime);
    	}

    	function audio_play_pause_handler() {
    		paused = this.paused;
    		$$invalidate(6, paused);
    	}

    	function audio_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			audioElement = $$value;
    			$$invalidate(3, audioElement);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ("src" in $$props) $$invalidate(0, src = $$props.src);
    		if ("active" in $$props) $$invalidate(1, active = $$props.active);
    		if ("credits" in $$props) $$invalidate(2, credits = $$props.credits);
    	};

    	$$self.$capture_state = () => ({
    		src,
    		active,
    		credits,
    		Progress,
    		PlayPause,
    		audioElement,
    		currentTime,
    		duration,
    		paused,
    		formatTime
    	});

    	$$self.$inject_state = $$props => {
    		if ("src" in $$props) $$invalidate(0, src = $$props.src);
    		if ("active" in $$props) $$invalidate(1, active = $$props.active);
    		if ("credits" in $$props) $$invalidate(2, credits = $$props.credits);
    		if ("audioElement" in $$props) $$invalidate(3, audioElement = $$props.audioElement);
    		if ("currentTime" in $$props) $$invalidate(4, currentTime = $$props.currentTime);
    		if ("duration" in $$props) $$invalidate(5, duration = $$props.duration);
    		if ("paused" in $$props) $$invalidate(6, paused = $$props.paused);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		src,
    		active,
    		credits,
    		audioElement,
    		currentTime,
    		duration,
    		paused,
    		formatTime,
    		audio_durationchange_handler,
    		audio_timeupdate_handler,
    		audio_play_pause_handler,
    		audio_binding
    	];
    }

    class AudioPlayer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, { src: 0, active: 1, credits: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "AudioPlayer",
    			options,
    			id: create_fragment$9.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*src*/ ctx[0] === undefined && !("src" in props)) {
    			console.warn("<AudioPlayer> was created without expected prop 'src'");
    		}

    		if (/*active*/ ctx[1] === undefined && !("active" in props)) {
    			console.warn("<AudioPlayer> was created without expected prop 'active'");
    		}

    		if (/*credits*/ ctx[2] === undefined && !("credits" in props)) {
    			console.warn("<AudioPlayer> was created without expected prop 'credits'");
    		}
    	}

    	get src() {
    		throw new Error("<AudioPlayer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set src(value) {
    		throw new Error("<AudioPlayer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get active() {
    		throw new Error("<AudioPlayer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set active(value) {
    		throw new Error("<AudioPlayer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get credits() {
    		throw new Error("<AudioPlayer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set credits(value) {
    		throw new Error("<AudioPlayer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/routes/pieces/Conjuring.svelte generated by Svelte v3.32.3 */
    const file$8 = "src/routes/pieces/Conjuring.svelte";

    function create_fragment$a(ctx) {
    	let div0;
    	let iframe;
    	let iframe_src_value;
    	let t0;
    	let div5;
    	let div2;
    	let div1;
    	let h10;
    	let t2;
    	let h20;
    	let t4;
    	let p0;
    	let t5;
    	let br0;
    	let t6;
    	let br1;
    	let t7;
    	let br2;
    	let t8;
    	let t9;
    	let p1;
    	let t10;
    	let br3;
    	let t11;
    	let br4;
    	let t12;
    	let br5;
    	let t13;
    	let t14;
    	let p2;
    	let t15;
    	let br6;
    	let t16;
    	let br7;
    	let t17;
    	let br8;
    	let t18;
    	let t19;
    	let img0;
    	let img0_src_value;
    	let t20;
    	let div3;
    	let p3;
    	let t21;
    	let br9;
    	let t22;
    	let br10;
    	let t23;
    	let br11;
    	let t24;
    	let t25;
    	let p4;
    	let t26;
    	let br12;
    	let t27;
    	let br13;
    	let t28;
    	let br14;
    	let t29;
    	let t30;
    	let p5;
    	let t31;
    	let br15;
    	let t32;
    	let br16;
    	let t33;
    	let br17;
    	let t34;
    	let t35;
    	let img1;
    	let img1_src_value;
    	let t36;
    	let div4;
    	let p6;
    	let t37;
    	let br18;
    	let t38;
    	let br19;
    	let t39;
    	let br20;
    	let t40;
    	let t41;
    	let p7;
    	let t42;
    	let br21;
    	let t43;
    	let br22;
    	let t44;
    	let br23;
    	let t45;
    	let div5_intro;
    	let div5_outro;
    	let t46;
    	let div6;
    	let audioplayer;
    	let t47;
    	let div10;
    	let div8;
    	let div7;
    	let h11;
    	let t49;
    	let h21;
    	let t51;
    	let p8;
    	let t52;
    	let br24;
    	let t53;
    	let br25;
    	let t54;
    	let br26;
    	let t55;
    	let br27;
    	let t56;
    	let br28;
    	let t57;
    	let br29;
    	let t58;
    	let br30;
    	let t59;
    	let br31;
    	let t60;
    	let br32;
    	let t61;
    	let br33;
    	let t62;
    	let br34;
    	let t63;
    	let t64;
    	let img2;
    	let img2_src_value;
    	let t65;
    	let div9;
    	let p9;
    	let t66;
    	let br35;
    	let t67;
    	let br36;
    	let t68;
    	let br37;
    	let t69;
    	let br38;
    	let t70;
    	let br39;
    	let t71;
    	let br40;
    	let t72;
    	let br41;
    	let t73;
    	let br42;
    	let t74;
    	let br43;
    	let t75;
    	let br44;
    	let t76;
    	let br45;
    	let t77;
    	let br46;
    	let t78;
    	let br47;
    	let t79;
    	let br48;
    	let t80;
    	let t81;
    	let img3;
    	let img3_src_value;
    	let t82;
    	let div11;
    	let p10;
    	let em0;
    	let t84;
    	let em1;
    	let t86;
    	let t87;
    	let p11;
    	let em2;
    	let t89;
    	let em3;
    	let t91;
    	let em4;
    	let t93;
    	let t94;
    	let p12;
    	let t95;
    	let em5;
    	let t97;
    	let a;
    	let t99;
    	let current;

    	audioplayer = new AudioPlayer({
    			props: {
    				src: "/assets/audio/nidhi-michael.mp3",
    				active: true,
    				credits: "Read by Nidhi Zak/Aria Eipe & Michael Dooley."
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			iframe = element("iframe");
    			t0 = space();
    			div5 = element("div");
    			div2 = element("div");
    			div1 = element("div");
    			h10 = element("h1");
    			h10.textContent = "The Conjuring";
    			t2 = space();
    			h20 = element("h2");
    			h20.textContent = "Nidhi Zak/Aria Eipe";
    			t4 = space();
    			p0 = element("p");
    			t5 = text("how a horse, or more, rose");
    			br0 = element("br");
    			t6 = text("\n      from the water, still and gray");
    			br1 = element("br");
    			t7 = text("\n      as a lake how could they know");
    			br2 = element("br");
    			t8 = text("\n      the truth: an ambush of snow");
    			t9 = space();
    			p1 = element("p");
    			t10 = text("how the crane called to its kin");
    			br3 = element("br");
    			t11 = text("\n      faint, auriga moving through");
    			br4 = element("br");
    			t12 = text("\n      a home, stranger, a shadow");
    			br5 = element("br");
    			t13 = text("\n      falling low across the limen");
    			t14 = space();
    			p2 = element("p");
    			t15 = text("how a mare stood sentinel");
    			br6 = element("br");
    			t16 = text("\n      by the door, wise eyes wide");
    			br7 = element("br");
    			t17 = text("\n      unblinking foaling sprawling");
    			br8 = element("br");
    			t18 = text("\n      twin kings, a flagstone floor");
    			t19 = space();
    			img0 = element("img");
    			t20 = space();
    			div3 = element("div");
    			p3 = element("p");
    			t21 = text("how we bore your temper wild");
    			br9 = element("br");
    			t22 = text("\n      spur upon our backs a man");
    			br10 = element("br");
    			t23 = text("\n      hounded, as our mother yet");
    			br11 = element("br");
    			t24 = text("\n      outruns us, how she stuns us");
    			t25 = space();
    			p4 = element("p");
    			t26 = text("with her pain, mooned belly");
    			br12 = element("br");
    			t27 = text("\n      heaving life, sharp her cries");
    			br13 = element("br");
    			t28 = text("\n      cursing their men days five");
    			br14 = element("br");
    			t29 = text("\n      lineal nine across the line");
    			t30 = space();
    			p5 = element("p");
    			t31 = text("how the birds shift beneath");
    			br15 = element("br");
    			t32 = text("\n      lust’s gaze, how they turned");
    			br16 = element("br");
    			t33 = text("\n      on you, swift as a whipping");
    			br17 = element("br");
    			t34 = text("\n      boy caught in a bind of rage");
    			t35 = space();
    			img1 = element("img");
    			t36 = space();
    			div4 = element("div");
    			p6 = element("p");
    			t37 = text("how they trembled, the fury");
    			br18 = element("br");
    			t38 = text("\n      filled sprites as you suffered");
    			br19 = element("br");
    			t39 = text("\n      the life you were denied then");
    			br20 = element("br");
    			t40 = text("\n      married to the envy of a bride");
    			t41 = space();
    			p7 = element("p");
    			t42 = text("how they’ll swear you loved");
    			br21 = element("br");
    			t43 = text("\n      but one of us, singular, true:");
    			br22 = element("br");
    			t44 = text("\n      balking, bridled, only one —");
    			br23 = element("br");
    			t45 = text("\n      brother standing before you.");
    			t46 = space();
    			div6 = element("div");
    			create_component(audioplayer.$$.fragment);
    			t47 = space();
    			div10 = element("div");
    			div8 = element("div");
    			div7 = element("div");
    			h11 = element("h1");
    			h11.textContent = "Dubh Sainglend to Liath Macha, on Cú Chulainn’s Death";
    			t49 = space();
    			h21 = element("h2");
    			h21.textContent = "Michael Dooley";
    			t51 = space();
    			p8 = element("p");
    			t52 = text("You were first from the shore of her, the dam who slipped us in the dark; ");
    			br24 = element("br");
    			t53 = text("\n      who slung like coin her womb’s worth at the door, left us to weave our tongues");
    			br25 = element("br");
    			t54 = text("\n      in each other’s eyes; to lick the water from our backs, the Moorhen at our\n      mouths. ");
    			br26 = element("br");
    			t55 = text("\n      I smelled her once in fog, the night the sounds of war split beyond the fort\n      — ");
    			br27 = element("br");
    			t56 = text("\n      trills of curlew magicked into cries of slaughtered men, wind-tap of branches\n      ");
    			br28 = element("br");
    			t57 = text("\n      shaped to clanging blades. And when they saddled us and led us");
    			br29 = element("br");
    			t58 = text("\n      to the Valley of the Deaf, we tasted her on grasses, in the downwind rot\n      ");
    			br30 = element("br");
    			t59 = text("\n      of that hooked and sweet-flowered tree; heard her heave in the draws of river,\n      ");
    			br31 = element("br");
    			t60 = text("\n      her groan in pushing us from pools — white cascades popping at the falls\n      ");
    			br32 = element("br");
    			t61 = text("\n      our birth-bleached hooves. Was she in the blood that let from your eye?\n      ");
    			br33 = element("br");
    			t62 = text("\n      That shape aroused in the wine that spilled three times, or in the woman at\n      the crossing ford, ");
    			br34 = element("br");
    			t63 = text("\n      all sorrows and spoiled armour, who wept he was to die? Was her snort the gale\n      that lunged");
    			t64 = space();
    			img2 = element("img");
    			t65 = space();
    			div9 = element("div");
    			p9 = element("p");
    			t66 = text("a spear of some warrior’s spited kin, tore Láegh from his root like a\n      soft-soiled yew, ");
    			br35 = element("br");
    			t67 = text("\n      ran him as a spring beneath our hocks? What could I but run, and Cú Chulainn\n      torn ");
    			br36 = element("br");
    			t68 = text("\n      like a bag of meal, regarding with wonder that hole in himself — little rat\n      rip, ");
    			br37 = element("br");
    			t69 = text("\n      clean as a saddler’s punch — like a blink in recollection, or a net laboured\n      into shore ");
    			br38 = element("br");
    			t70 = text("\n      only to see it fat with his own catch, and picked by many hands? I left him\n      for the sorceresses, ");
    			br39 = element("br");
    			t71 = text("\n      and salmon-snorted home; broke woodlands with my goosegrass breast, stamped\n      crescents ");
    			br40 = element("br");
    			t72 = text("\n      in mud and shale, startled a hag turning rope in the dew, passed strangers’\n      palisades, ");
    			br41 = element("br");
    			t73 = text("\n      and laughing children mad like calves at dusk, until I stood and shook before\n      water in the glen. ");
    			br42 = element("br");
    			t74 = text("\n      And when I dipped my shameful head to step beneath a mirror of the moon, your\n      form went hurtling");
    			br43 = element("br");
    			t75 = text(" from the shimmer of my lips: turning in the\n      bindweed root like an otter hunting crays; ");
    			br44 = element("br");
    			t76 = text("\n      broken pottery of skulls a shingle beneath your feet, the thirty skins behind\n      your teeth. ");
    			br45 = element("br");
    			t77 = text("\n      And I saw Cú Chulainn, too, pinned to the stone in his own twines, a sick-cloth\n      fluttering ");
    			br46 = element("br");
    			t78 = text("\n      in wind, in current; saw the raven berry-picking hedges of his bursting sides.");
    			br47 = element("br");
    			t79 = text("\n      I will leave this Milesian pit, this festered wound in water; will slip beneath\n      the tail of it, ");
    			br48 = element("br");
    			t80 = text("\n      grow wings again and drown, before her.");
    			t81 = space();
    			img3 = element("img");
    			t82 = space();
    			div11 = element("div");
    			p10 = element("p");
    			em0 = element("em");
    			em0.textContent = "The Conjuring";
    			t84 = text(", written by Nidhi Zak/Aria Eipe. Nidhi Zak/Aria Eipe\n    is a poet, pacifist and fabulist. ");
    			em1 = element("em");
    			em1.textContent = "Auguries of a Minor God";
    			t86 = text(", her\n    debut poetry collection, is forthcoming from Faber & Faber in July 2021.\n    There is little that she would not trade in for a horse.");
    			t87 = space();
    			p11 = element("p");
    			em2 = element("em");
    			em2.textContent = "Dubh Sainglend to Liath Macha, on Cú Chulainn’s Death";
    			t89 = text(", was written\n    by Michael Dooley. Michael Dooley’s poems have appeared in\n    ");
    			em3 = element("em");
    			em3.textContent = "Poetry Ireland Review";
    			t91 = text(", ");
    			em4 = element("em");
    			em4.textContent = "The Stinging Fly";
    			t93 = text(", and online at RTE\n    Culture. In 2020, he was shortlisted for The Strokestown International\n    Poetry Competition, The Doolin Poetry Prize, and The Cúirt New Writing\n    Prize. He is a teacher, and lives in Limerick.");
    			t94 = space();
    			p12 = element("p");
    			t95 = text("Video ");
    			em5 = element("em");
    			em5.textContent = "&";
    			t97 = text(" Images by\n    ");
    			a = element("a");
    			a.textContent = "Yingge Xu";
    			t99 = text(".");
    			if (iframe.src !== (iframe_src_value = "https://player.vimeo.com/video/523755168?title=0&byline=0&portrait=0&badge=0&autopause=0&player_id=0&app_id=58479")) attr_dev(iframe, "src", iframe_src_value);
    			attr_dev(iframe, "width", "1920");
    			attr_dev(iframe, "height", "1080");
    			attr_dev(iframe, "frameborder", "0");
    			attr_dev(iframe, "allow", "autoplay; fullscreen; picture-in-picture");
    			iframe.allowFullscreen = true;
    			attr_dev(iframe, "title", "Mystic - Video (B_W).mov");
    			attr_dev(iframe, "class", "svelte-1tglku4");
    			add_location(iframe, file$8, 22, 2, 706);
    			attr_dev(div0, "class", "video-wrapper svelte-1tglku4");
    			add_location(div0, file$8, 21, 0, 676);
    			attr_dev(h10, "class", "svelte-1tglku4");
    			add_location(h10, file$8, 40, 6, 1272);
    			attr_dev(h20, "class", "svelte-1tglku4");
    			add_location(h20, file$8, 41, 6, 1301);
    			attr_dev(div1, "class", "poem-header svelte-1tglku4");
    			add_location(div1, file$8, 39, 4, 1240);
    			attr_dev(br0, "class", "svelte-1tglku4");
    			add_location(br0, file$8, 44, 32, 1381);
    			attr_dev(br1, "class", "svelte-1tglku4");
    			add_location(br1, file$8, 45, 36, 1424);
    			attr_dev(br2, "class", "svelte-1tglku4");
    			add_location(br2, file$8, 46, 35, 1466);
    			attr_dev(p0, "class", "svelte-1tglku4");
    			add_location(p0, file$8, 43, 4, 1345);
    			attr_dev(br3, "class", "svelte-1tglku4");
    			add_location(br3, file$8, 51, 37, 1563);
    			attr_dev(br4, "class", "svelte-1tglku4");
    			add_location(br4, file$8, 52, 34, 1604);
    			attr_dev(br5, "class", "svelte-1tglku4");
    			add_location(br5, file$8, 53, 32, 1643);
    			attr_dev(p1, "class", "svelte-1tglku4");
    			add_location(p1, file$8, 50, 4, 1522);
    			attr_dev(br6, "class", "svelte-1tglku4");
    			add_location(br6, file$8, 58, 31, 1734);
    			attr_dev(br7, "class", "svelte-1tglku4");
    			add_location(br7, file$8, 59, 33, 1774);
    			attr_dev(br8, "class", "svelte-1tglku4");
    			add_location(br8, file$8, 60, 34, 1815);
    			attr_dev(p2, "class", "svelte-1tglku4");
    			add_location(p2, file$8, 57, 4, 1699);
    			attr_dev(div2, "class", "text t1 svelte-1tglku4");
    			add_location(div2, file$8, 38, 2, 1214);
    			if (img0.src !== (img0_src_value = "assets/images/y3.jpg")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "class", "poem-image y2 svelte-1tglku4");
    			attr_dev(img0, "alt", "Mountain");
    			add_location(img0, file$8, 64, 2, 1878);
    			attr_dev(br9, "class", "svelte-1tglku4");
    			add_location(br9, file$8, 67, 34, 2016);
    			attr_dev(br10, "class", "svelte-1tglku4");
    			add_location(br10, file$8, 68, 31, 2054);
    			attr_dev(br11, "class", "svelte-1tglku4");
    			add_location(br11, file$8, 69, 32, 2093);
    			attr_dev(p3, "class", "svelte-1tglku4");
    			add_location(p3, file$8, 66, 4, 1978);
    			attr_dev(br12, "class", "svelte-1tglku4");
    			add_location(br12, file$8, 74, 33, 2186);
    			attr_dev(br13, "class", "svelte-1tglku4");
    			add_location(br13, file$8, 75, 35, 2228);
    			attr_dev(br14, "class", "svelte-1tglku4");
    			add_location(br14, file$8, 76, 33, 2268);
    			attr_dev(p4, "class", "svelte-1tglku4");
    			add_location(p4, file$8, 73, 4, 2149);
    			attr_dev(br15, "class", "svelte-1tglku4");
    			add_location(br15, file$8, 81, 33, 2360);
    			attr_dev(br16, "class", "svelte-1tglku4");
    			add_location(br16, file$8, 82, 34, 2401);
    			attr_dev(br17, "class", "svelte-1tglku4");
    			add_location(br17, file$8, 83, 33, 2441);
    			attr_dev(p5, "class", "svelte-1tglku4");
    			add_location(p5, file$8, 80, 4, 2323);
    			attr_dev(div3, "class", "text t2 svelte-1tglku4");
    			add_location(div3, file$8, 65, 2, 1952);
    			if (img1.src !== (img1_src_value = "assets/images/y5.jpg")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "class", "poem-image y5 svelte-1tglku4");
    			attr_dev(img1, "alt", "Mountain");
    			add_location(img1, file$8, 87, 2, 2503);
    			attr_dev(br18, "class", "svelte-1tglku4");
    			add_location(br18, file$8, 90, 33, 2640);
    			attr_dev(br19, "class", "svelte-1tglku4");
    			add_location(br19, file$8, 91, 36, 2683);
    			attr_dev(br20, "class", "svelte-1tglku4");
    			add_location(br20, file$8, 92, 35, 2725);
    			attr_dev(p6, "class", "svelte-1tglku4");
    			add_location(p6, file$8, 89, 4, 2603);
    			attr_dev(br21, "class", "svelte-1tglku4");
    			add_location(br21, file$8, 96, 33, 2819);
    			attr_dev(br22, "class", "svelte-1tglku4");
    			add_location(br22, file$8, 97, 36, 2862);
    			attr_dev(br23, "class", "svelte-1tglku4");
    			add_location(br23, file$8, 98, 34, 2903);
    			attr_dev(p7, "class", "svelte-1tglku4");
    			add_location(p7, file$8, 95, 4, 2782);
    			attr_dev(div4, "class", "text t3 svelte-1tglku4");
    			add_location(div4, file$8, 88, 2, 2577);
    			attr_dev(div5, "class", "poem-wrapper nt svelte-1tglku4");
    			add_location(div5, file$8, 33, 0, 1040);
    			attr_dev(div6, "class", "player-wrapper svelte-1tglku4");
    			add_location(div6, file$8, 104, 0, 2971);
    			attr_dev(h11, "class", "svelte-1tglku4");
    			add_location(h11, file$8, 115, 6, 3245);
    			attr_dev(h21, "class", "svelte-1tglku4");
    			add_location(h21, file$8, 116, 6, 3314);
    			attr_dev(div7, "class", "poem-header svelte-1tglku4");
    			add_location(div7, file$8, 114, 4, 3213);
    			attr_dev(br24, "class", "svelte-1tglku4");
    			add_location(br24, file$8, 119, 80, 3437);
    			attr_dev(br25, "class", "svelte-1tglku4");
    			add_location(br25, file$8, 121, 84, 3534);
    			attr_dev(br26, "class", "svelte-1tglku4");
    			add_location(br26, file$8, 124, 14, 3642);
    			attr_dev(br27, "class", "svelte-1tglku4");
    			add_location(br27, file$8, 126, 8, 3740);
    			attr_dev(br28, "class", "svelte-1tglku4");
    			add_location(br28, file$8, 128, 6, 3837);
    			attr_dev(br29, "class", "svelte-1tglku4");
    			add_location(br29, file$8, 129, 68, 3912);
    			attr_dev(br30, "class", "svelte-1tglku4");
    			add_location(br30, file$8, 131, 6, 4004);
    			attr_dev(br31, "class", "svelte-1tglku4");
    			add_location(br31, file$8, 133, 6, 4102);
    			attr_dev(br32, "class", "svelte-1tglku4");
    			add_location(br32, file$8, 135, 6, 4194);
    			attr_dev(br33, "class", "svelte-1tglku4");
    			add_location(br33, file$8, 137, 6, 4285);
    			attr_dev(br34, "class", "svelte-1tglku4");
    			add_location(br34, file$8, 139, 25, 4399);
    			attr_dev(p8, "class", "svelte-1tglku4");
    			add_location(p8, file$8, 118, 4, 3353);
    			attr_dev(div8, "class", "text wide t4 svelte-1tglku4");
    			add_location(div8, file$8, 113, 2, 3182);
    			if (img2.src !== (img2_src_value = "assets/images/y4.jpg")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "class", "poem-image y4 svelte-1tglku4");
    			attr_dev(img2, "alt", "Mountain");
    			add_location(img2, file$8, 144, 2, 4529);
    			attr_dev(br35, "class", "svelte-1tglku4");
    			add_location(br35, file$8, 148, 23, 4737);
    			attr_dev(br36, "class", "svelte-1tglku4");
    			add_location(br36, file$8, 150, 11, 4838);
    			attr_dev(br37, "class", "svelte-1tglku4");
    			add_location(br37, file$8, 152, 11, 4938);
    			attr_dev(br38, "class", "svelte-1tglku4");
    			add_location(br38, file$8, 154, 17, 5045);
    			attr_dev(br39, "class", "svelte-1tglku4");
    			add_location(br39, file$8, 156, 27, 5161);
    			attr_dev(br40, "class", "svelte-1tglku4");
    			add_location(br40, file$8, 158, 16, 5266);
    			attr_dev(br41, "class", "svelte-1tglku4");
    			add_location(br41, file$8, 160, 17, 5372);
    			attr_dev(br42, "class", "svelte-1tglku4");
    			add_location(br42, file$8, 162, 25, 5488);
    			attr_dev(br43, "class", "svelte-1tglku4");
    			add_location(br43, file$8, 164, 24, 5603);
    			attr_dev(br44, "class", "svelte-1tglku4");
    			add_location(br44, file$8, 165, 49, 5703);
    			attr_dev(br45, "class", "svelte-1tglku4");
    			add_location(br45, file$8, 167, 18, 5812);
    			attr_dev(br46, "class", "svelte-1tglku4");
    			add_location(br46, file$8, 169, 17, 5922);
    			attr_dev(br47, "class", "svelte-1tglku4");
    			add_location(br47, file$8, 170, 84, 6013);
    			attr_dev(br48, "class", "svelte-1tglku4");
    			add_location(br48, file$8, 173, 22, 6134);
    			attr_dev(p9, "class", "svelte-1tglku4");
    			add_location(p9, file$8, 146, 4, 4634);
    			attr_dev(div9, "class", "text wide t5 svelte-1tglku4");
    			add_location(div9, file$8, 145, 2, 4603);
    			if (img3.src !== (img3_src_value = "assets/images/y1.jpg")) attr_dev(img3, "src", img3_src_value);
    			attr_dev(img3, "class", "poem-image y1 svelte-1tglku4");
    			attr_dev(img3, "alt", "Mountain");
    			add_location(img3, file$8, 177, 2, 6207);
    			attr_dev(div10, "class", "poem-wrapper mt svelte-1tglku4");
    			add_location(div10, file$8, 112, 0, 3150);
    			add_location(em0, file$8, 182, 4, 6324);
    			add_location(em1, file$8, 183, 38, 6438);
    			add_location(p10, file$8, 181, 2, 6316);
    			add_location(em2, file$8, 188, 4, 6631);
    			add_location(em3, file$8, 190, 4, 6774);
    			add_location(em4, file$8, 190, 36, 6806);
    			add_location(p11, file$8, 187, 2, 6623);
    			add_location(em5, file$8, 196, 10, 7075);
    			attr_dev(a, "href", "https://www.artofthebrush.ie/");
    			add_location(a, file$8, 197, 4, 7100);
    			add_location(p12, file$8, 195, 2, 7061);
    			attr_dev(div11, "class", "credits text");
    			add_location(div11, file$8, 180, 0, 6287);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, iframe);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div5, anchor);
    			append_dev(div5, div2);
    			append_dev(div2, div1);
    			append_dev(div1, h10);
    			append_dev(div1, t2);
    			append_dev(div1, h20);
    			append_dev(div2, t4);
    			append_dev(div2, p0);
    			append_dev(p0, t5);
    			append_dev(p0, br0);
    			append_dev(p0, t6);
    			append_dev(p0, br1);
    			append_dev(p0, t7);
    			append_dev(p0, br2);
    			append_dev(p0, t8);
    			append_dev(div2, t9);
    			append_dev(div2, p1);
    			append_dev(p1, t10);
    			append_dev(p1, br3);
    			append_dev(p1, t11);
    			append_dev(p1, br4);
    			append_dev(p1, t12);
    			append_dev(p1, br5);
    			append_dev(p1, t13);
    			append_dev(div2, t14);
    			append_dev(div2, p2);
    			append_dev(p2, t15);
    			append_dev(p2, br6);
    			append_dev(p2, t16);
    			append_dev(p2, br7);
    			append_dev(p2, t17);
    			append_dev(p2, br8);
    			append_dev(p2, t18);
    			append_dev(div5, t19);
    			append_dev(div5, img0);
    			append_dev(div5, t20);
    			append_dev(div5, div3);
    			append_dev(div3, p3);
    			append_dev(p3, t21);
    			append_dev(p3, br9);
    			append_dev(p3, t22);
    			append_dev(p3, br10);
    			append_dev(p3, t23);
    			append_dev(p3, br11);
    			append_dev(p3, t24);
    			append_dev(div3, t25);
    			append_dev(div3, p4);
    			append_dev(p4, t26);
    			append_dev(p4, br12);
    			append_dev(p4, t27);
    			append_dev(p4, br13);
    			append_dev(p4, t28);
    			append_dev(p4, br14);
    			append_dev(p4, t29);
    			append_dev(div3, t30);
    			append_dev(div3, p5);
    			append_dev(p5, t31);
    			append_dev(p5, br15);
    			append_dev(p5, t32);
    			append_dev(p5, br16);
    			append_dev(p5, t33);
    			append_dev(p5, br17);
    			append_dev(p5, t34);
    			append_dev(div5, t35);
    			append_dev(div5, img1);
    			append_dev(div5, t36);
    			append_dev(div5, div4);
    			append_dev(div4, p6);
    			append_dev(p6, t37);
    			append_dev(p6, br18);
    			append_dev(p6, t38);
    			append_dev(p6, br19);
    			append_dev(p6, t39);
    			append_dev(p6, br20);
    			append_dev(p6, t40);
    			append_dev(div4, t41);
    			append_dev(div4, p7);
    			append_dev(p7, t42);
    			append_dev(p7, br21);
    			append_dev(p7, t43);
    			append_dev(p7, br22);
    			append_dev(p7, t44);
    			append_dev(p7, br23);
    			append_dev(p7, t45);
    			insert_dev(target, t46, anchor);
    			insert_dev(target, div6, anchor);
    			mount_component(audioplayer, div6, null);
    			insert_dev(target, t47, anchor);
    			insert_dev(target, div10, anchor);
    			append_dev(div10, div8);
    			append_dev(div8, div7);
    			append_dev(div7, h11);
    			append_dev(div7, t49);
    			append_dev(div7, h21);
    			append_dev(div8, t51);
    			append_dev(div8, p8);
    			append_dev(p8, t52);
    			append_dev(p8, br24);
    			append_dev(p8, t53);
    			append_dev(p8, br25);
    			append_dev(p8, t54);
    			append_dev(p8, br26);
    			append_dev(p8, t55);
    			append_dev(p8, br27);
    			append_dev(p8, t56);
    			append_dev(p8, br28);
    			append_dev(p8, t57);
    			append_dev(p8, br29);
    			append_dev(p8, t58);
    			append_dev(p8, br30);
    			append_dev(p8, t59);
    			append_dev(p8, br31);
    			append_dev(p8, t60);
    			append_dev(p8, br32);
    			append_dev(p8, t61);
    			append_dev(p8, br33);
    			append_dev(p8, t62);
    			append_dev(p8, br34);
    			append_dev(p8, t63);
    			append_dev(div10, t64);
    			append_dev(div10, img2);
    			append_dev(div10, t65);
    			append_dev(div10, div9);
    			append_dev(div9, p9);
    			append_dev(p9, t66);
    			append_dev(p9, br35);
    			append_dev(p9, t67);
    			append_dev(p9, br36);
    			append_dev(p9, t68);
    			append_dev(p9, br37);
    			append_dev(p9, t69);
    			append_dev(p9, br38);
    			append_dev(p9, t70);
    			append_dev(p9, br39);
    			append_dev(p9, t71);
    			append_dev(p9, br40);
    			append_dev(p9, t72);
    			append_dev(p9, br41);
    			append_dev(p9, t73);
    			append_dev(p9, br42);
    			append_dev(p9, t74);
    			append_dev(p9, br43);
    			append_dev(p9, t75);
    			append_dev(p9, br44);
    			append_dev(p9, t76);
    			append_dev(p9, br45);
    			append_dev(p9, t77);
    			append_dev(p9, br46);
    			append_dev(p9, t78);
    			append_dev(p9, br47);
    			append_dev(p9, t79);
    			append_dev(p9, br48);
    			append_dev(p9, t80);
    			append_dev(div10, t81);
    			append_dev(div10, img3);
    			insert_dev(target, t82, anchor);
    			insert_dev(target, div11, anchor);
    			append_dev(div11, p10);
    			append_dev(p10, em0);
    			append_dev(p10, t84);
    			append_dev(p10, em1);
    			append_dev(p10, t86);
    			append_dev(div11, t87);
    			append_dev(div11, p11);
    			append_dev(p11, em2);
    			append_dev(p11, t89);
    			append_dev(p11, em3);
    			append_dev(p11, t91);
    			append_dev(p11, em4);
    			append_dev(p11, t93);
    			append_dev(div11, t94);
    			append_dev(div11, p12);
    			append_dev(p12, t95);
    			append_dev(p12, em5);
    			append_dev(p12, t97);
    			append_dev(p12, a);
    			append_dev(p12, t99);
    			current = true;
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (div5_outro) div5_outro.end(1);

    				if (!div5_intro) div5_intro = create_in_transition(div5, blur, {
    					delay: 100,
    					duration: 800,
    					amount: 10,
    					easing: identity
    				});

    				div5_intro.start();
    			});

    			transition_in(audioplayer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (div5_intro) div5_intro.invalidate();

    			div5_outro = create_out_transition(div5, blur, {
    				delay: 0,
    				duration: 600,
    				amount: 10,
    				easing: identity
    			});

    			transition_out(audioplayer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div5);
    			if (detaching && div5_outro) div5_outro.end();
    			if (detaching) detach_dev(t46);
    			if (detaching) detach_dev(div6);
    			destroy_component(audioplayer);
    			if (detaching) detach_dev(t47);
    			if (detaching) detach_dev(div10);
    			if (detaching) detach_dev(t82);
    			if (detaching) detach_dev(div11);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Conjuring", slots, []);

    	onMount(() => {
    		document.title = "View Source | 'The Conjuring' / 'Dubh Sainglend to Liath Macha, on Cú Chulainn’s Death'";
    		let blobs = document.querySelectorAll(".blob");
    		[...blobs].forEach(el => move(el));
    		themeColour.update(theme => "#fff");
    		headerOpacity.update(o => 0.5);
    		blob1.update(c => "#c16a7cb5");
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Conjuring> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		blur,
    		linear: identity,
    		onMount,
    		themeColour,
    		headerOpacity,
    		blob1,
    		move,
    		AudioPlayer
    	});

    	return [];
    }

    class Conjuring extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Conjuring",
    			options,
    			id: create_fragment$a.name
    		});
    	}
    }

    /* src/routes/pieces/Butterfly.svelte generated by Svelte v3.32.3 */
    const file$9 = "src/routes/pieces/Butterfly.svelte";

    function create_fragment$b(ctx) {
    	let div0;
    	let svg;
    	let polyline;
    	let t0;
    	let div2;
    	let articleheader;
    	let updating_audioActive;
    	let t1;
    	let audioplayer;
    	let t2;
    	let div1;
    	let p0;
    	let t4;
    	let p1;
    	let t6;
    	let p2;
    	let t8;
    	let p3;
    	let t10;
    	let p4;
    	let t12;
    	let p5;
    	let t14;
    	let p6;
    	let t16;
    	let p7;
    	let t18;
    	let p8;
    	let t20;
    	let p9;
    	let t22;
    	let p10;
    	let t24;
    	let p11;
    	let t26;
    	let p12;
    	let t28;
    	let p13;
    	let t30;
    	let p14;
    	let t32;
    	let p15;
    	let t34;
    	let p16;
    	let t36;
    	let p17;
    	let t38;
    	let p18;
    	let t40;
    	let p19;
    	let t42;
    	let p20;
    	let t44;
    	let p21;
    	let t46;
    	let p22;
    	let t48;
    	let p23;
    	let t50;
    	let p24;
    	let t52;
    	let p25;
    	let t54;
    	let p26;
    	let t56;
    	let p27;
    	let t58;
    	let p28;
    	let t60;
    	let p29;
    	let t62;
    	let p30;
    	let t64;
    	let p31;
    	let t66;
    	let p32;
    	let t68;
    	let p33;
    	let t70;
    	let p34;
    	let t72;
    	let p35;
    	let t74;
    	let p36;
    	let t76;
    	let p37;
    	let t78;
    	let p38;
    	let t80;
    	let p39;
    	let t82;
    	let p40;
    	let t84;
    	let p41;
    	let t86;
    	let p42;
    	let t88;
    	let p43;
    	let t90;
    	let p44;
    	let t92;
    	let p45;
    	let br;
    	let t93;
    	let p46;
    	let div2_intro;
    	let div2_outro;
    	let t95;
    	let div3;
    	let p47;
    	let em0;
    	let t97;
    	let a;
    	let em1;
    	let t99;
    	let current;

    	function articleheader_audioActive_binding(value) {
    		/*articleheader_audioActive_binding*/ ctx[1](value);
    	}

    	let articleheader_props = {
    		title: "Butterfly",
    		author: "Colm O'Shea"
    	};

    	if (/*audioActive*/ ctx[0] !== void 0) {
    		articleheader_props.audioActive = /*audioActive*/ ctx[0];
    	}

    	articleheader = new ArticleHeader({
    			props: articleheader_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(articleheader, "audioActive", articleheader_audioActive_binding));

    	audioplayer = new AudioPlayer({
    			props: {
    				src: "/assets/audio/butterfly.mp3",
    				active: /*audioActive*/ ctx[0],
    				credits: "Composed and performed by Tom Roseingrave."
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			svg = svg_element("svg");
    			polyline = svg_element("polyline");
    			t0 = space();
    			div2 = element("div");
    			create_component(articleheader.$$.fragment);
    			t1 = space();
    			create_component(audioplayer.$$.fragment);
    			t2 = space();
    			div1 = element("div");
    			p0 = element("p");
    			p0.textContent = "A border is a line made by man. A border is a line made by woman. A border\n      is not real. A border is an agreement that something unreal is real. A\n      border is an agreed exclusion. A border is a way of saying what is here\n      and what is there are different. A border is a way of describing a\n      difference.";
    			t4 = space();
    			p1 = element("p");
    			p1.textContent = "It starts in the airport. It starts before the airport. It starts by not\n      saying, by not telling. It starts in the airport, looking around without\n      being seen to look around for faces who would not know why I am in the\n      airport. It’s about not being seen. It’s about making up excuses, making\n      up stories. It’s about being consistent in my stories. It’s about telling\n      people the same lie. It’s about knowing it’s best to tell one lie. It’s\n      about knowing that one lie is easier to remember, one lie is easier to not\n      trip over, one lie is less likely to be questioned if everyone believes it\n      to be true. It’s about lying about being somewhere else when you’re in an\n      airport.";
    			t6 = space();
    			p2 = element("p");
    			p2.textContent = "She has to know where every border is. She can’t get caught. She can’t get\n      caught out. She has to know where everything stops and everything starts.\n      It’s a survival instinct. It’s automatic now. She has to read every\n      situation and know where she is. She has to know whether she’s crossed a\n      border and how to act. She has to know how near she is to a border, and\n      whether to turn and go back or prepare to cross over. She has to be\n      whatever is expected of her on any side of any border.";
    			t8 = space();
    			p3 = element("p");
    			p3.textContent = "In a room listening to the artist Tamarin Norwood speak. I know the other\n      speakers but not her. That is, I’ve heard others mention her and her work,\n      but have never come across it until now. I strain to remember what is\n      being said, what she is saying. I know I will forget a lot of what she is\n      saying. I always do. I’m hoping someone is recording the event but I’ll\n      find out later that no one is. I won’t be the only one regretting that the\n      event isn’t being recorded.";
    			t10 = space();
    			p4 = element("p");
    			p4.textContent = "A border is a boundary. A border is more than a line drawn in the sand. A\n      border is a line drawn to mean something more than a line. A border is\n      meant to say more about what is beyond the line, on either side. A border\n      becomes nothing when you see a border because a border is a line drawn and\n      a line drawn only has the thickness it has been given. A border drawn can\n      be reduced to nothing if you allow it because a line can be reduced to\n      nothing if you allow it, but a border is a shared belief that a line means\n      something.";
    			t12 = space();
    			p5 = element("p");
    			p5.textContent = "Crossing the border doesn’t make it any easier. Crossing the border is\n      when real field craft comes into play. Crossing the border means there can\n      be no excuses, no stories, no lies. Getting caught crossing a border means\n      no escape. Even before the airport and the border it’s the messages and\n      the codes. It’s the letter drops and the fake names. It’s covering tracks.\n      Field craft teaches you that it’s easier to cover tracks before you’ve\n      even made them. It’s easier now and it’s harder. Different contacts,\n      different names, different addresses. Knowing who she is when she contacts\n      you even if the name isn’t your name for her. Knowing how to respond.\n      Knowing which questions are safe to ask and which will only cause trouble.\n      Field craft is knowing how much I can say without the risk of blowing her\n      cover, or mine.";
    			t14 = space();
    			p6 = element("p");
    			p6.textContent = "A line means something. A line means direction. A line is a vector. A line\n      can be a vector but either side of a line is nothing unless you say it is\n      something, unless you agree it is something. A line becomes a border when\n      either side of the line means more than the line itself.";
    			t16 = space();
    			p7 = element("p");
    			p7.textContent = "The first train is the greatest risk, it’s the greatest risk of being\n      spotted. I try to find a seat to stay inconspicuous but it’s standing room\n      only. It means I can watch the stations as we approach. It means I can\n      make a dash for the door before I’m spotted. It means I’m on edge the\n      entire time. Ignore what’s outside the windows. Don’t be a tourist, don’t\n      be a visitor. Blend in. Disappear. Be like everyone else. Glance at what\n      passes by the window the same way everyone else glances at what passes by\n      the window because we’ve all seen it a million times before. Don’t meet\n      anyone’s eyes, without meaning to not meet their eyes. Everyone else on\n      the train is a potential trap. Everyone else on the train could be the\n      cause of getting caught.";
    			t18 = space();
    			p8 = element("p");
    			p8.textContent = "The room is full. I arrive early, earlier than I had planned, and take a\n      seat away from the door. Watch the room fill up. The rest of the audience\n      will know the other speakers, and her and her work, far better than I\n      will. I know I will paraphrase. I know I will misinterpret. I know I will\n      want to speak to her after the event but I will never get the chance. That\n      is, I will be sitting in the pub after the event with friends and she will\n      be sitting nearby with friends and I will mean to dip into her\n      conversation on the way out to tell her how interesting I found the\n      evening, hearing her speak, hearing her explain her work. But when the end\n      of the evening comes, when the end of my evening comes and I put my coat\n      on to leave, I say nothing to her.";
    			t20 = space();
    			p9 = element("p");
    			p9.textContent = "She has to be invisible. She has to be discrete. She has to be at home\n      wherever she stands. She is a spy. She has to live as a spy. When she\n      speaks she has to know how to speak. When she speaks she has to know what\n      name to give and to stick with that name. The easiest way for a spy to\n      have their cover blown is to trip themselves up. Inconsistency means\n      death. She has to know where she is, stick to being whoever she is on that\n      side of that border and never waiver.";
    			t22 = space();
    			p10 = element("p");
    			p10.textContent = "A place has no meaning without a border. A place is a space given a name\n      by a man. A place is a space given a name by a woman. A place has no\n      meaning without a border. A place is a nothing until it comes to an end;\n      otherwise it is just a nothing. A place has no meaning until it meets\n      another place. A place and a place only have meaning in themselves when\n      they meet. When two places meet and become something it is the border that\n      gives them meaning. So that means places have no meaning without a border\n      which has no meaning without it being given a meaning by a man or a woman,\n      by men or women.";
    			t24 = space();
    			p11 = element("p");
    			p11.textContent = "I haven’t messaged her yet. I meant to before I left the airport but I\n      walked in the middle of a group all moving in the same direction. I’m less\n      likely to be picked out that way. I have my papers if needed but the less\n      chance I give them to ask me any questions the better my chances are. I\n      count the stations before I have to change trains. I don’t look up. I’m as\n      bored as everyone else beside me. I should message her. I look at my phone\n      but it’s as much to avoid looking up as anything else. I have no signal\n      but I know I’ll have a chance when I change trains. The platforms are\n      crowded but staying in the middle is the safest place of all. Changing\n      trains means emerging into the open air before going underground again.";
    			t26 = space();
    			p12 = element("p");
    			p12.textContent = "Places have no meaning until they are given a meaning by giving them a\n      name. Nothing has a meaning until it is given a name. Nothing exists until\n      it is given a name. A butterfly does not exist until it is named. A\n      non-existent butterfly is free to cross a non-existent border. To name a\n      butterfly is to catch it. To catch a butterfly is to want to hold it in\n      your hands. To catch a butterfly is to risk crushing it. No butterfly\n      seeks out the net. A name is also a limit. A name is a limit given by\n      somebody else. A butterfly does not exist until it is captured and killed\n      and stuck to a board with a pin through its heart. Is a pin only a pin and\n      a butterfly only a butterfly when they come into contact? A butterfly only\n      has a name when a difference is defined between one butterfly and another.\n      A butterfly only exists when a line is drawn between one butterfly and\n      another. A butterfly only exists when a border is drawn between one\n      butterfly and another by a man or a woman. Metaphor is murder.";
    			t28 = space();
    			p13 = element("p");
    			p13.textContent = "I message her to say I’m on my way. Nothing more. Nothing less. If they\n      know I’m here we’re caught anyway. If not it’s just the same message as\n      hundreds, if not thousands, are sending this moment across the city.\n      Changing trains means a safer train. I’m less likely to be spotted now.\n      Moving through a safer part of town. I take a seat, holding my bag in\n      front of me. I remember on a similar train with a larger bag accidentally\n      hitting a man across the shins. I apologised immediately but he continued\n      to wince and rub his leg for the rest of the journey. Today my bag is\n      smaller, less obtrusive. My bag is no bigger than many others I see around\n      me. My bag is easily forgettable. My bag is like me. A man and a bag on a\n      train going nowhere important. That’s all anyone will see.";
    			t30 = space();
    			p14 = element("p");
    			p14.textContent = "A border is a line drawn but a line drawn can be changed. A border can be\n      changed. A difference can be changed. The difference between here and\n      there can be erased or revised by the erasure or revision of a border. The\n      definition of what is acceptable here and unacceptable there can be\n      redefined and redrawn like a border. A border has no meaning except for\n      that difference in meaning either side of it. A border is where someone\n      says no. A border is where a difference is applied. A border is where what\n      you do is not acceptable but what we do is.";
    			t32 = space();
    			p15 = element("p");
    			p15.textContent = "She’ll pass by many names keeping her own locked safely in a box. To me\n      she’s Jane but she doesn’t go by that name with anybody else. Every time\n      she hears one of her names on a street or across a room she has to know\n      where she is and who she is this time. She can’t afford to have her cover\n      blown by answering a name she hasn’t been called. One doubt. One question\n      and she’s dead.";
    			t34 = space();
    			p16 = element("p");
    			p16.textContent = "I look her work up afterwards to see if I get it right, if what I remember\n      is consistent with what she talks about and how she represents her work. I\n      will get it wrong. That is I listen to her speak and describe how she\n      works and what she is trying to do and I hear it in relation to this\n      piece. That is I have the germ of this piece in my head, a few scribbles\n      on pieces of paper I keep in my back pocket and swap from trousers to\n      trousers with a handkerchief as I add to them until I am ready to begin. I\n      hear her speak and watch her work on the screen and think of it in terms\n      of what is in my head. That means I will get it wrong. That means I will\n      misrepresent her and her work. That means I will regret that the event is\n      not recorded so at least there would be an accurate record of the artist\n      speaking that isn’t filtered through a different idea in my head.";
    			t36 = space();
    			p17 = element("p");
    			p17.textContent = "There’s no reply from her. I don’t expect one. We’re underground now\n      anyway. She knows when I’m due to arrive. At the final station I wheel my\n      bag up the ramp and out onto the street. At the top of the ramp I move in\n      beside a wall and check my phone. Still nothing from her. A few other\n      passengers pass me by. One walks in the direction I’m going while the\n      others turn right and wait at the pedestrian crossing. It’s about\n      watching. Waiting I can see if I’m being followed. Waiting I can see if\n      they’re on to me. Nothing. Nothing from them and nothing from her.";
    			t38 = space();
    			p18 = element("p");
    			p18.textContent = "She can only relax when she knows where she is. Enter a room, read a room,\n      watch. All the time watch without watching. Look without looking. Listen\n      without listening. Read without reading. All the time paying attention\n      without appearing to pay attention. All the time looking for that crack.\n      All the time looking for that one person with that one voice with that one\n      name looking for that one reaction that would blow her cover. Like the\n      time she was questioned in Buenos Aries. These were only casual questions.\n      These were only an effort to make conversation. These were just someone\n      trying to get to know her, maybe flirt a little, maybe ask her to dance or\n      have a drink. Innocent questions near the wrong ears. Innocent questions\n      near ears that shouldn’t have been listening to innocent questions.\n      Keeping her cover while answering innocent questions.";
    			t40 = space();
    			p19 = element("p");
    			p19.textContent = "Borders exist because of force. Borders exist because of agreement.\n      Borders exist because of consent. A border is a line around a place. A\n      border is a line around a people. A border is a line around a person. To\n      cross a border around a place or a people is to consent to what is\n      acceptable within that border. To cross a border is to be told that what\n      is acceptable elsewhere is not acceptable here.";
    			t42 = space();
    			p20 = element("p");
    			p20.textContent = "Her building is only a couple of minutes away. I should say nothing but I\n      message her again to say I’m at the station. I’m waiting for the all\n      clear. I’m waiting for her to say it’s safe to come up. I keep my head\n      down on the street. It’s too close and too late to have my cover blown\n      now. If they get me now they get us both. Still nothing from her. The\n      trick is to not stop now. The trick is to keep walking. The trick is to\n      make it look like my destination is still some way off. I pass her\n      building. If I look down one of the side streets I can see her door. If I\n      look up from her door I can see her window. I keep my head down. I keep\n      walking. I can walk around the block a few times until she says it’s safe,\n      until she’s ready for me to call. I guess the layout of the streets and\n      walk laps of her building, of her street. I glance behind me when I can to\n      check. Few people pass me. It’s a quiet day around this part of the city.";
    			t44 = space();
    			p21 = element("p");
    			p21.textContent = "A border is a list of instructions. A border is a list of instructions on\n      how to live. A border is a list of instructions on how to act. To cross a\n      border is to accept that you will comply with the list of instructions\n      that is the border. To cross a border while paying lip service to the\n      border, to the list of instructions, is to be a spy. To be a spy is to\n      recognise that a border exists but to refuse to act as the border\n      requires. To cross a border as a spy is to risk being found out. To cross\n      a border as a spy is to live with the fear that you will be exposed as a\n      spy. To be exposed as a spy is to pay a heavy price. To be exposed as a\n      spy is to be exposed as someone who refuses to live by the list of\n      instructions that the border supplies.";
    			t46 = space();
    			p22 = element("p");
    			p22.textContent = "Tamsin Norwood speaks about the point, the point of contact between a\n      stylus, a nib, and a page, between point and page. As she speaks a video\n      plays of one of her works. I will learn later it is called Keeping Time. I\n      will learn this while searching online to try to learn if what I remember\n      of the event and her work is accurate. The video shows the point of\n      contact between a pen and a page. The video follows the nib of the pen, of\n      two pens, or of one pen recorded twice, as it moves around a page, as it\n      makes a mark on the page. I watch the nib and the page. I watch the nib\n      moving around the page. I watch the mark it leaves on the page. I watch\n      what results from a nib and a page coming into contact.";
    			t48 = space();
    			p23 = element("p");
    			p23.textContent = "The day hasn’t really begun around here. I could try to find a small café\n      and sit, and wait. But my inconspicuous bag on the train could become a\n      conspicuous bag now. Avoid shops. Avoid cafes. Avoid bars. Just keep\n      walking. I pass a woman walking a dog. Has she passed me before? Think.\n      Has she? Did I notice the dog the first time around and not her? Fuck.\n      Stupid, beginner’s mistake. Watch. That’s the whole thing, watch without\n      being seen to watch. I turn a corner and pass a school. Make a note. Don’t\n      pass this way again. You can pass an office building, a row of shops or\n      apartments or houses, or anywhere else more than once. But you can’t pass\n      a school for a second time. Walking past a school again attracts\n      questions. A man passing a school again wheeling a bag attracts attention,\n      attracts questions. A man passing a school again is a fool and deserves to\n      have his cover blown.";
    			t50 = space();
    			p24 = element("p");
    			p24.textContent = "Borders exist within borders. A spy can live within a border and only\n      become a spy when they choose to disobey the list of instructions that the\n      border supplies. A spy can live their life without ever crossing the\n      border and becoming a spy. A spy does not have to act for anyone or\n      anything outside the border. A spy can be a spy for him or herself. A spy\n      does not have to be recruited. A spy does not have to be turned. A spy\n      does not have to be a spy on behalf of anyone else. A spy can choose to be\n      a spy for themselves and no one else. A border is a line made by man. A\n      border is a line made by woman. A spy can live within a border and choose\n      not to live as the border requires.";
    			t52 = space();
    			p25 = element("p");
    			p25.textContent = "I want to message her again, I want to pass her building and pass her\n      door, pass under her window. I want to look up as I pass under her window\n      and see her watching for me. I check my phone. I check my phone again. I\n      walk and I check my phone. It’s late. She’s late. I try to avoid walking\n      up and down the same streets but I’m conscious of not walking too far from\n      her place in case she messages me and tells me to come up. Behind her\n      building a main road skirts the river. I could sit on a bench and look at\n      the river. A man wheeling a bag sitting on a bench looking at the river\n      won’t attract any attention. I only see one bench; a woman is feeding a\n      young child. I walk past them.";
    			t54 = space();
    			p26 = element("p");
    			p26.textContent = "So easy to slip up. But she knows what she’s doing. She knows the game. It\n      becomes second nature for her to cover her tracks. It becomes second\n      nature to look over her shoulder without making it look like she’s looking\n      over her shoulder. It becomes second nature to check every street before\n      entering any door. Walking into a hotel or out of a bar. Putting on a hat\n      or adjusting a scarf. Fixing her gloves in the cold or fanning herself in\n      the heat. A nothing gesture by anybody else, an afterthought. Taking that\n      one small moment to look, to see, to watch.";
    			t56 = space();
    			p27 = element("p");
    			p27.textContent = "Without the nib touching the page there is nothing. That is there is a nib\n      and there is a page. But a nib is something that makes a mark and a page\n      is something that receives and records the mark of a nib. So is a nib a\n      nib if it isn’t touching a page? Is a page a page if there is nothing\n      making contact with it leaving a mark? Is a nib only a nib and a page only\n      a page when they come into contact? Is all we know of their existence the\n      record of what happens when the nib and the page come into contact?";
    			t58 = space();
    			p28 = element("p");
    			p28.textContent = "The list of instructions defined by a border can be more than the law. The\n      list of instructions defined by a border may never be written down. The\n      list of instructions defined by a border may require those living within\n      the border to live and act in a particular way different from those who\n      may live outside the border and those within the border will never be told\n      or never need to be told. The list of instructions provided by a border\n      can exist unwritten for generations and be followed by everyone within the\n      border automatically. The list of instructions provided by a border define\n      a way to act that complies with the wishes of the border. The list of\n      instructions provided by a border define a way to act that complies with\n      the wishes of the border as defined by those within the border who drew\n      the line to form the border.";
    			t60 = space();
    			p29 = element("p");
    			p29.textContent = "Did she get my message? Did she have to go out? Did something come up? Did\n      someone call? Can she answer my message? I picture someone calling and\n      taking up her time. I picture her trying to act normally and being polite\n      while the light flashes on her phone indicating my message. I picture her\n      trying to get her caller to leave, to find an excuse to check her phone\n      and message me to call later. I picture her trying to find a way to let me\n      know it’s not safe. I picture all the things that can go wrong but my\n      phone buzzes and she says to come up. At this point I just turn back on\n      myself. I don’t care. I have my phone in my hand so if I’m stopped, if I’m\n      questioned I can just say there’s been a change of plans and I have to go\n      in this direction instead of the other. I form a response to the question\n      but there’s no one there to ask me.";
    			t62 = space();
    			p30 = element("p");
    			p30.textContent = "When she walks she leaves no footprints. Nothing to say she was there.\n      Leaving every room is a meticulous operation. Checking out. Empty the\n      bathroom of every trace. Everything back in the bag. Everything in its\n      place. Leave nothing, forget nothing. No sign. No trace left behind. The\n      time she forgot a purse and panicked all the way to the airport. Relaxing\n      only when I went back to collect it. Remembering to give a different name.";
    			t64 = space();
    			p31 = element("p");
    			p31.textContent = "A border defines a way to act. A border defines a way to live. A border\n      defines what is the correct way to live and what is incorrect. A border is\n      nodding approval. A border is exposure and censure for those who\n      transgress the border. A border is ruin for those who transgress the\n      border. A spy lives within a border but chooses not to obey the border. A\n      spy does not ignore a border; to ignore a border is to risk exposure for\n      transgression of the border. A spy knows the border and respects the\n      border. A spy respects what a border can do. A spy lives his or her life\n      in constant awareness of the border. A spy lives his or her life in\n      constant awareness of what the border can do.";
    			t66 = space();
    			p32 = element("p");
    			p32.textContent = "If I’m spotted from a building, if I’m watched from a building it’s too\n      late anyway. If I’m recorded turning into the side street by the side of\n      her building it’s too late anyway. If someone is going to see me, if\n      someone is going to say or do anything it will be now. I approach her\n      door. I look up at her window. Even when I’m close enough I see nothing in\n      her window, nothing that isn’t in every other window. There’s a desk\n      inside the door of her building but it’s unmanned. Nobody there. Nobody in\n      the hallway. Nobody in the lift. Nobody in the corridor on her floor.\n      Looking left and right at her door. Knocking gently. Hearing nothing from\n      any of the doors I pass. Hearing nothing from the corridor behind or in\n      front of me. Hearing nothing but the lift moving on, up or down.";
    			t68 = space();
    			p33 = element("p");
    			p33.textContent = "Learning to contact her. Learning the dead letter drops. Learning the code\n      words. Learning the fake names and the real names. Learning to communicate\n      with a spy means learning to become a spy yourself. Learning to embrace\n      the game. Learning that if your cover is blown she will disappear to avoid\n      the risk of being blown herself. Learning to learn. Learning what you can\n      leave behind. Learning what is and isn’t important. Learning that it may\n      be important now but if it risks her cover being blown she will abandon it\n      without looking back. Learning that security is everything.";
    			t70 = space();
    			p34 = element("p");
    			p34.textContent = "A spy chooses to transgress a border because a spy chooses to live outside\n      of the list of instructions provided by a border. A spy learns quickly how\n      to act to avoid suspicion. A spy learns quickly or a spy is exposed. An\n      exposed spy is a lost spy. An exposed spy is a blown spy. A blown spy is\n      lost. A spy learns to live outwardly as if they respect and obey\n      everything that the border requires. A spy lives from safehouse to\n      safehouse. A safehouse is a space a spy defines that is inside a border\n      but outside the world of the border. A safehouse is defined by a line\n      drawn by a spy. A safehouse is defined by a border drawn by a spy. Within\n      the border of a safehouse a spy lives and acts as they choose.";
    			t72 = space();
    			p35 = element("p");
    			p35.textContent = "Hearing nothing but her singing. Hearing nothing but her undoing the chain\n      and the door opening. She’s singing gently as the door opens. She stands\n      behind the door as I step through so the first time I see her is when she\n      closes the door behind me. Seeing her in the dim light of the hallway and\n      putting my arms around her. First, gentle kiss. First gentle kiss of being\n      here. First gentle kiss of being safe.";
    			t74 = space();
    			p36 = element("p");
    			p36.textContent = "She gauges every story. What to tell and what not to tell. Which names to\n      change and which to leave in. Which names to just omit all together and\n      just tell a story about a friend. She knows how to tell any story in a way\n      that barely leaves any traces. She knows who she has told and what she has\n      told them. She knows who she has told and who she hasn’t. She knows how to\n      pick up different conversations at just the right point so they look like\n      the only conversations in the world.";
    			t76 = space();
    			p37 = element("p");
    			p37.textContent = "The door is the line we draw between us and the rest. The door is the line\n      we draw to say we are here and everything else is excluded. The door is\n      the border we close. The door is our border, meaning we and only we make\n      the laws here, we decide what is right and what is wrong. We decide how we\n      should act and we decide to exclude everyone else who says otherwise.";
    			t78 = space();
    			p38 = element("p");
    			p38.textContent = "I think about borders. I think about boundaries. I think about edges. I\n      think about the idea that things only come into existence when they come\n      into contact with another. I follow the nib moving over the page leaving\n      its mark and I see the mark as the only record of its existence. At one\n      point Tamasin Norwood describes taking a pen and marking a border around\n      the inside of a house she and her husband had just vacated because they\n      were moving somewhere else. I don’t know if she means to mention this\n      event as part of her talk or just chooses to include it as an anecdote\n      supporting her overall fascination with the point of contact between a nib\n      and a page. By drawing a line she is drawing a border. By drawing a border\n      around the interior of every room is she creating the room? By drawing a\n      border is she describing that this room, this house, is now different from\n      what is outside the border? By drawing this line, this border, is what is\n      inside this border something else? By drawing this border is she saying\n      that this house was not a house, it was a home? By drawing this border is\n      she saying that this house is now different from all the other houses\n      outside the border because they are just houses and this was a home?";
    			t80 = space();
    			p39 = element("p");
    			p39.textContent = "Checking herself when she crosses a border she files away anything she\n      won’t need, any stories she won’t need. Every spy operates in a cell of\n      their own. Every spy operates without wires. Every spy has a safehouse.\n      Knowing what to leave in a safehouse and what to leave elsewhere. Knowing\n      who to tell about the safehouse and who to never let know it even exists.\n      Looking at a face and deciding in an instant how much to tell them.\n      Looking at a face and deciding in an instant that they will learn nothing.\n      Taking a circuitous route back to the safehouse. Making it look like there\n      is no safehouse. Allowing me into the safehouse.";
    			t82 = space();
    			p40 = element("p");
    			p40.textContent = "I tell stories. She sings. I put on some music and we dance. We kiss. She\n      makes a meal. I watch and offer to help. We sit on the couch in each\n      other’s arms. We watch the day darken and end outside. We draw the\n      curtains before turning on a light. She tells me stories. We kiss. Share\n      the bathroom washing our teeth. We have drawn our border and now this\n      place is our country, our land. These rooms are our empire. The door with\n      the chain drawn is our border we’ve closed. We touch as we pass cleaning\n      up glasses and rinsing plates. We undress and slip beneath the covers. We\n      decree that it is too cold outside of the bed for either of us to leave.\n      This is our country and these are our laws. The line we have drawn is the\n      only line that matters. We make love and feed off the heat of each other.\n      Behind our closed border the only currency is the heat of our bodies. The\n      only language is touch and kiss.";
    			t84 = space();
    			p41 = element("p");
    			p41.textContent = "I know I could be getting her work very wrong. I know if I ask her and\n      suggest what I think as I listen to her speak and watch the video of her\n      work and consider her story that I could be getting everything wrong, very\n      wrong. I know this and I know that by asking her she will explain where I\n      am going wrong. But as I choose to not talk to her in the pub after the\n      event, as I choose not to ask her I know I will probably never know. So I\n      will keep my wrongness, in whatever shape it may be.";
    			t86 = space();
    			p42 = element("p");
    			p42.textContent = "Knowing what is out there about her. Making sure she leaves no traces. No\n      breadcrumbs to follow. Like the time, horse riding in the hills above the\n      city. Pretending to the guide that phones had been forgotten and left back\n      in the car so she couldn’t take a photograph. Knowing just what to say to\n      make sure she leaves no footprints. Knowing how cautious she has to be\n      because she knows what will happen if she gets caught. She knows the\n      penalty for being a spy. She knows the price she would pay. Knowing the\n      risk. Knowing the reward. She is a spy but she crosses the border for me.";
    			t88 = space();
    			p43 = element("p");
    			p43.textContent = "The enemy of every border is time. Time erodes and erases borders. Borders\n      that stand for millennia disappear in an instant. Borders that stand and\n      repel invaders for generations eventually fall over nothing. The enemy is\n      time. We make love in the morning to feed our border. We eat breakfast and\n      shower and return to bed to make love to keep our border intact. But time\n      is the enemy. Time is the enemy and our border cannot hold. Time is the\n      enemy and our border crumbles and I have to go.";
    			t90 = space();
    			p44 = element("p");
    			p44.textContent = "The door is just a door now. The chain is just a chain. The corridor\n      outside is the same corridor as it was before it was a border post. We\n      kiss before I pass through the door, we kiss before I cross what is left\n      of the border. We kiss and I promise to message her as soon as I get home.\n      We kiss and we already make plans to declare our own country again. There\n      will be walls. There will be dogs and searchlights. There will be other\n      borders to cross and lies to keep. There will be codes and secret\n      messages, checking for watchers and disappearing in plain sight. But we\n      will draw our line. We will make our border again and stake out our own\n      land. We will close a door and seal it with a line and ward off the world.";
    			t92 = space();
    			p45 = element("p");
    			br = element("br");
    			t93 = space();
    			p46 = element("p");
    			p46.textContent = "⁙";
    			t95 = space();
    			div3 = element("div");
    			p47 = element("p");
    			em0 = element("em");
    			em0.textContent = "Butterfly";
    			t97 = text(", written by Colm O'Shea, was first published in\n    ");
    			a = element("a");
    			em1 = element("em");
    			em1.textContent = "gorse";
    			t99 = text(". Colm O'Shea is a writer living\n    in Dublin.");
    			attr_dev(polyline, "points", "1423.5,31.5 1367.5,31.5 1367.5,64.5 1310.5,64.5 1310.5,55.5 1287.5,55.5 1287.5,39.5 1310.5,39.5 1310.5,30.5 1279.5,30.5 1279.5,66.5 1296.5,66.5 1296.5,74.5 1387.5,74.5 1387.5,115.5 1407.5,115.5 1407.5,136.5 1371.5,136.5 1371.5,160.5 1332.5,160.5 1332.5,254.5 1413.5,254.5 1413.5,266.5 1282.5,266.5 1282.5,207.5 1319.5,207.5 1319.5,142.5 1355.5,142.5 1355.5,89.5 1286.5,89.5 1286.5,80.5 1261.5,80.5 1261.5,51.5 1238.5,51.5 1238.5,92.5 1276.5,92.5 1276.5,124.5 1238.5,124.5 1238.5,151.5 1289.5,151.5 1289.5,98.5 1347.5,98.5 1347.5,124.5 1307.5,124.5 1307.5,192.5 1280.5,192.5 1280.5,158.5 1259.5,158.5 1259.5,283.5 1226.5,283.5 1226.5,224.5 1207.5,224.5 1207.5,277.5 1195.5,277.5 1195.5,182.5 1181.5,182.5 1181.5,297.5 1399.5,297.5 1399.5,625.5 1307.5,625.5 1307.5,688.5 1361.5,688.5 1361.5,763.5 1377.5,763.5 1377.5,704.5 1392.5,704.5 1392.5,773.5 1340.5,773.5 1340.5,709.5 1267.5,709.5 1267.5,675.5 1231.5,675.5 1231.5,760.5 1246.5,760.5 1246.5,712.5 1259.5,712.5 1259.5,760.5 1305.5,760.5 1305.5,736.5 1268.5,736.5 1268.5,719.5 1322.5,719.5 1322.5,770.5 1225.5,770.5 1225.5,666.5 1293.5,666.5 1293.5,654.5 1179.5,654.5 1179.5,751.5 1199.5,751.5 1199.5,700.5 1211.5,700.5 1211.5,766.5 1165.5,766.5 1165.5,622.5 1201.5,622.5 1201.5,634.5 1264.5,634.5 1264.5,622.5 1217.5,622.5 1217.5,545.5 1201.5,545.5 1201.5,609.5 1190.5,609.5 1190.5,542.5 1180.5,542.5 1180.5,609.5 1167.5,609.5 1167.5,525.5 1241.5,525.5 1241.5,609.5 1382.5,609.5 1382.5,592.5 1258.5,592.5 1258.5,510.5 1164.5,510.5 1164.5,489.5 1268.5,489.5 1268.5,573.5 1282.5,573.5 1282.5,473.5 1164.5,473.5 1164.5,401.5 1184.5,401.5 1184.5,460.5 1201.5,460.5 1201.5,400.5 1314.5,400.5 1314.5,445.5 1276.5,445.5 1276.5,413.5 1216.5,413.5 1216.5,460.5 1228.5,460.5 1228.5,422.5 1265.5,422.5 1265.5,443.5 1250.5,443.5 1250.5,430.5 1240.5,430.5 1240.5,455.5 1325.5,455.5 1325.5,385.5 1159.5,385.5 1159.5,342.5 1273.5,342.5 1273.5,366.5 1341.5,366.5 1341.5,466.5 1296.5,466.5 1296.5,576.5 1365.5,576.5 1365.5,542.5 1319.5,542.5 1319.5,480.5 1355.5,480.5 1355.5,355.5 1295.5,355.5 1295.5,340.5 1367.5,340.5 1367.5,510.5 1346.5,510.5 1346.5,497.5 1329.5,497.5 1329.5,525.5 1379.5,525.5 1379.5,319.5 1156.5,319.5 1156.5,173.5 1210.5,173.5 1210.5,209.5 1228.5,209.5 1228.5,157.5 1156.5,157.5 1156.5,83.5 1216.5,83.5 1216.5,95.5 1179.5,95.5 1179.5,142.5 1225.5,142.5 1225.5,48.5 1170.5,48.5 1170.5,74.5 1155.5,74.5 1155.5,49.5 1144.5,49.5 1144.5,655.5 1116.5,655.5 1116.5,552.5 1126.5,552.5 1126.5,470.5 1116.5,470.5 1116.5,540.5 1101.5,540.5 1101.5,667.5 1138.5,667.5 1138.5,767.5 1126.5,767.5 1126.5,683.5 1083.5,683.5 1083.5,479.5 1095.5,479.5 1095.5,522.5 1107.5,522.5 1107.5,464.5 1090.5,464.5 1090.5,413.5 1113.5,413.5 1113.5,454.5 1125.5,454.5 1125.5,404.5 1084.5,404.5 1084.5,448.5 1073.5,448.5 1073.5,695.5 1116.5,695.5 1116.5,712.5 1019.5,712.5 1019.5,758.5 1047.5,758.5 1047.5,718.5 1068.5,718.5 1068.5,754.5 1089.5,754.5 1089.5,743.5 1074.5,743.5 1074.5,728.5 1104.5,728.5 1104.5,769.5 1005.5,769.5 1005.5,692.5 1053.5,692.5 1053.5,615.5 1034.5,615.5 1034.5,678.5 955.5,678.5 955.5,739.5 974.5,739.5 974.5,719.5 992.5,719.5 992.5,749.5 938.5,749.5 938.5,660.5 1022.5,660.5 1022.5,595.5 1040.5,595.5 1040.5,573.5 1055.5,573.5 1055.5,412.5 1043.5,412.5 1043.5,457.5 1035.5,457.5 1035.5,403.5 1071.5,403.5 1071.5,418.5 1064.5,418.5 1064.5,430.5 1079.5,430.5 1079.5,392.5 1025.5,392.5 1025.5,575.5 1005.5,575.5 1005.5,373.5 1079.5,373.5 1079.5,339.5 1095.5,339.5 1095.5,386.5 1119.5,386.5 1119.5,324.5 1068.5,324.5 1068.5,361.5 1050.5,361.5 1050.5,307.5 1117.5,307.5 1117.5,270.5 1073.5,270.5 1073.5,255.5 1117.5,255.5 1117.5,227.5 1064.5,227.5 1064.5,282.5 1093.5,282.5 1093.5,292.5 1055.5,292.5 1055.5,212.5 1119.5,212.5 1119.5,131.5 1104.5,131.5 1104.5,191.5 1056.5,191.5 1056.5,58.5 1077.5,58.5 1077.5,152.5 1090.5,152.5 1090.5,45.5 1041.5,45.5 1041.5,149.5 971.5,149.5 971.5,121.5 995.5,121.5 995.5,95.5 958.5,95.5 958.5,164.5 1031.5,164.5 1031.5,361.5 995.5,361.5 995.5,591.5 1008.5,591.5 1008.5,637.5 925.5,637.5 925.5,667.5 908.5,667.5 908.5,622.5 995.5,622.5 995.5,610.5 887.5,610.5 887.5,769.5 907.5,769.5 907.5,682.5 922.5,682.5 922.5,785.5 708.5,785.5 708.5,749.5 658.5,749.5 658.5,760.5 361.5,760.5 361.5,700.5 129.5,700.5 129.5,685.5 372.5,685.5 372.5,745.5 640.5,745.5 640.5,733.5 720.5,733.5 720.5,761.5 734.5,761.5 734.5,746.5 843.5,746.5 843.5,725.5 619.5,725.5 619.5,733.5 383.5,733.5 383.5,672.5 113.5,672.5 113.5,686.5 75.5,686.5 75.5,627.5 37.5,627.5 37.5,609.5 86.5,609.5 86.5,673.5 105.5,673.5 105.5,658.5 396.5,658.5 396.5,719.5 598.5,719.5 598.5,704.5 408.5,704.5 408.5,655.5 431.5,655.5 431.5,689.5 614.5,689.5 614.5,710.5 844.5,710.5 844.5,695.5 786.5,695.5 786.5,643.5 832.5,643.5 832.5,664.5 807.5,664.5 807.5,675.5 841.5,675.5 841.5,631.5 783.5,631.5 783.5,610.5 855.5,610.5 855.5,773.5 873.5,773.5 873.5,591.5 978.5,591.5 978.5,345.5 1011.5,345.5 1011.5,325.5 965.5,325.5 965.5,385.5 940.5,385.5 940.5,307.5 1013.5,307.5 1013.5,179.5 943.5,179.5 943.5,82.5 1004.5,82.5 1004.5,125.5 1025.5,125.5 1025.5,70.5 929.5,70.5 929.5,191.5 998.5,191.5 998.5,207.5 928.5,207.5 928.5,282.5 987.5,282.5 987.5,271.5 950.5,271.5 950.5,255.5 987.5,255.5 987.5,230.5 973.5,230.5 973.5,246.5 958.5,246.5 958.5,218.5 998.5,218.5 998.5,295.5 928.5,295.5 928.5,337.5 911.5,337.5 911.5,45.5 896.5,45.5 896.5,351.5 917.5,351.5 917.5,397.5 959.5,397.5 959.5,572.5 856.5,572.5 856.5,594.5 765.5,594.5 765.5,695.5 646.5,695.5 646.5,621.5 623.5,621.5 623.5,675.5 449.5,675.5 449.5,642.5 101.5,642.5 101.5,612.5 293.5,612.5 293.5,634.5 356.5,634.5 356.5,624.5 305.5,624.5 305.5,613.5 446.5,613.5 446.5,604.5 101.5,604.5 101.5,224.5 199.5,224.5 199.5,167.5 166.5,167.5 166.5,131.5 126.5,131.5 126.5,124.5 175.5,124.5 175.5,160.5 211.5,160.5 211.5,233.5 110.5,233.5 110.5,589.5 462.5,589.5 462.5,661.5 613.5,661.5 613.5,610.5 656.5,610.5 656.5,685.5 668.5,685.5 668.5,610.5 734.5,610.5 734.5,640.5 681.5,640.5 681.5,669.5 750.5,669.5 750.5,580.5 843.5,580.5 843.5,557.5 947.5,557.5 947.5,418.5 878.5,418.5 878.5,400.5 905.5,400.5 905.5,366.5 868.5,366.5 868.5,473.5 834.5,473.5 834.5,248.5 770.5,248.5 770.5,204.5 831.5,204.5 831.5,100.5 758.5,100.5 758.5,257.5 783.5,257.5 783.5,282.5 747.5,282.5 747.5,83.5 847.5,83.5 847.5,454.5 862.5,454.5 862.5,355.5 886.5,355.5 886.5,68.5 734.5,68.5 734.5,295.5 816.5,295.5 816.5,492.5 875.5,492.5 875.5,428.5 932.5,428.5 932.5,503.5 805.5,503.5 805.5,379.5 743.5,379.5 743.5,343.5 807.5,343.5 807.5,306.5 732.5,306.5 732.5,388.5 798.5,388.5 798.5,534.5 780.5,534.5 780.5,498.5 735.5,498.5 735.5,545.5 811.5,545.5 811.5,518.5 935.5,518.5 935.5,539.5 823.5,539.5 823.5,558.5 731.5,558.5 731.5,598.5 599.5,598.5 599.5,645.5 501.5,645.5 501.5,621.5 475.5,621.5 475.5,588.5 513.5,588.5 513.5,636.5 586.5,636.5 586.5,615.5 522.5,615.5 522.5,583.5 719.5,583.5 719.5,64.5 711.5,64.5 711.5,570.5 132.5,570.5 132.5,469.5 278.5,469.5 278.5,527.5 526.5,527.5 534.5,527.5 534.5,416.5 625.5,416.5 625.5,536.5 293.5,536.5 293.5,551.5 643.5,551.5 643.5,260.5 699.5,260.5 699.5,152.5 374.5,152.5 374.5,167.5 686.5,167.5 686.5,242.5 629.5,242.5 629.5,400.5 596.5,400.5 596.5,312.5 525.5,312.5 525.5,480.5 322.5,480.5 322.5,410.5 459.5,410.5 459.5,398.5 313.5,398.5 313.5,488.5 389.5,488.5 389.5,506.5 295.5,506.5 295.5,384.5 473.5,384.5 473.5,470.5 516.5,470.5 516.5,303.5 603.5,303.5 603.5,391.5 617.5,391.5 617.5,232.5 675.5,232.5 675.5,212.5 542.5,212.5 542.5,288.5 516.5,288.5 516.5,200.5 667.5,200.5 667.5,179.5 501.5,179.5 501.5,369.5 338.5,369.5 338.5,323.5 283.5,323.5 283.5,456.5 147.5,456.5 147.5,247.5 307.5,247.5 307.5,238.5 226.5,238.5 226.5,212.5 316.5,212.5 316.5,257.5 157.5,257.5 157.5,312.5 348.5,312.5 348.5,353.5 398.5,353.5 398.5,325.5 364.5,325.5 364.5,313.5 410.5,313.5 410.5,359.5 467.5,359.5 467.5,347.5 435.5,347.5 435.5,319.5 479.5,319.5 479.5,201.5 341.5,201.5 341.5,295.5 458.5,295.5 458.5,210.5 470.5,210.5 470.5,304.5 175.5,304.5 175.5,266.5 317.5,266.5 317.5,278.5 182.5,278.5 182.5,291.5 329.5,291.5 329.5,169.5 342.5,169.5 342.5,185.5 361.5,185.5 361.5,157.5 251.5,157.5 251.5,176.5 322.5,176.5 322.5,201.5 236.5,201.5 236.5,125.5 208.5,125.5 208.5,148.5 186.5,148.5 186.5,95.5 176.5,95.5 176.5,114.5 125.5,114.5 125.5,81.5 100.5,81.5 100.5,57.5 45.5,57.5");
    			attr_dev(polyline, "fill", "none");
    			attr_dev(polyline, "stroke", "#9F7385");
    			attr_dev(polyline, "stroke-miterlimit", "10");
    			attr_dev(polyline, "pathLength", "1");
    			attr_dev(polyline, "id", "line1");
    			attr_dev(polyline, "class", "svelte-4rx4lq");
    			add_location(polyline, file$9, 34, 5, 1177);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "viewBox", "0 0 1440 800");
    			attr_dev(svg, "class", "svelte-4rx4lq");
    			add_location(svg, file$9, 33, 2, 1109);
    			attr_dev(div0, "class", "line-wrapper svelte-4rx4lq");
    			add_location(div0, file$9, 32, 0, 1080);
    			add_location(p0, file$9, 59, 4, 9913);
    			add_location(p1, file$9, 66, 4, 10257);
    			add_location(p2, file$9, 78, 4, 11003);
    			add_location(p3, file$9, 87, 4, 11547);
    			add_location(p4, file$9, 96, 4, 12074);
    			add_location(p5, file$9, 106, 4, 12664);
    			add_location(p6, file$9, 120, 4, 13571);
    			add_location(p7, file$9, 126, 4, 13892);
    			add_location(p8, file$9, 139, 4, 14722);
    			add_location(p9, file$9, 152, 4, 15560);
    			add_location(p10, file$9, 161, 4, 16087);
    			add_location(p11, file$9, 172, 4, 16756);
    			add_location(p12, file$9, 184, 4, 17560);
    			add_location(p13, file$9, 200, 4, 18661);
    			add_location(p14, file$9, 213, 4, 19525);
    			add_location(p15, file$9, 223, 4, 20140);
    			add_location(p16, file$9, 231, 4, 20574);
    			add_location(p17, file$9, 245, 4, 21529);
    			add_location(p18, file$9, 255, 4, 22156);
    			add_location(p19, file$9, 269, 4, 23100);
    			add_location(p20, file$9, 277, 4, 23553);
    			add_location(p21, file$9, 292, 4, 24584);
    			add_location(p22, file$9, 305, 4, 25418);
    			add_location(p23, file$9, 317, 4, 26203);
    			add_location(p24, file$9, 332, 4, 27187);
    			add_location(p25, file$9, 344, 4, 27948);
    			add_location(p26, file$9, 356, 4, 28709);
    			add_location(p27, file$9, 366, 4, 29332);
    			add_location(p28, file$9, 375, 4, 29898);
    			add_location(p29, file$9, 389, 4, 30820);
    			add_location(p30, file$9, 403, 4, 31751);
    			add_location(p31, file$9, 411, 4, 32238);
    			add_location(p32, file$9, 423, 4, 32999);
    			add_location(p33, file$9, 436, 4, 33866);
    			add_location(p34, file$9, 446, 4, 34510);
    			add_location(p35, file$9, 458, 4, 35293);
    			add_location(p36, file$9, 466, 4, 35756);
    			add_location(p37, file$9, 475, 4, 36297);
    			add_location(p38, file$9, 482, 4, 36709);
    			add_location(p39, file$9, 501, 4, 38061);
    			add_location(p40, file$9, 512, 4, 38762);
    			add_location(p41, file$9, 527, 4, 39759);
    			add_location(p42, file$9, 536, 4, 40310);
    			add_location(p43, file$9, 546, 4, 40958);
    			add_location(p44, file$9, 555, 4, 41508);
    			add_location(br, file$9, 567, 7, 42307);
    			add_location(p45, file$9, 567, 4, 42304);
    			set_style(p46, "text-align", "center");
    			add_location(p46, file$9, 568, 4, 42322);
    			attr_dev(div1, "class", "text svelte-4rx4lq");
    			add_location(div1, file$9, 58, 2, 9890);
    			attr_dev(div2, "class", "text-wrapper");
    			add_location(div2, file$9, 45, 0, 9502);
    			add_location(em0, file$9, 574, 4, 42419);
    			add_location(em1, file$9, 575, 30, 42516);
    			attr_dev(a, "href", "http://gorse.ie");
    			add_location(a, file$9, 575, 4, 42490);
    			add_location(p47, file$9, 573, 2, 42411);
    			attr_dev(div3, "class", "credits text svelte-4rx4lq");
    			add_location(div3, file$9, 572, 0, 42382);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, svg);
    			append_dev(svg, polyline);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div2, anchor);
    			mount_component(articleheader, div2, null);
    			append_dev(div2, t1);
    			mount_component(audioplayer, div2, null);
    			append_dev(div2, t2);
    			append_dev(div2, div1);
    			append_dev(div1, p0);
    			append_dev(div1, t4);
    			append_dev(div1, p1);
    			append_dev(div1, t6);
    			append_dev(div1, p2);
    			append_dev(div1, t8);
    			append_dev(div1, p3);
    			append_dev(div1, t10);
    			append_dev(div1, p4);
    			append_dev(div1, t12);
    			append_dev(div1, p5);
    			append_dev(div1, t14);
    			append_dev(div1, p6);
    			append_dev(div1, t16);
    			append_dev(div1, p7);
    			append_dev(div1, t18);
    			append_dev(div1, p8);
    			append_dev(div1, t20);
    			append_dev(div1, p9);
    			append_dev(div1, t22);
    			append_dev(div1, p10);
    			append_dev(div1, t24);
    			append_dev(div1, p11);
    			append_dev(div1, t26);
    			append_dev(div1, p12);
    			append_dev(div1, t28);
    			append_dev(div1, p13);
    			append_dev(div1, t30);
    			append_dev(div1, p14);
    			append_dev(div1, t32);
    			append_dev(div1, p15);
    			append_dev(div1, t34);
    			append_dev(div1, p16);
    			append_dev(div1, t36);
    			append_dev(div1, p17);
    			append_dev(div1, t38);
    			append_dev(div1, p18);
    			append_dev(div1, t40);
    			append_dev(div1, p19);
    			append_dev(div1, t42);
    			append_dev(div1, p20);
    			append_dev(div1, t44);
    			append_dev(div1, p21);
    			append_dev(div1, t46);
    			append_dev(div1, p22);
    			append_dev(div1, t48);
    			append_dev(div1, p23);
    			append_dev(div1, t50);
    			append_dev(div1, p24);
    			append_dev(div1, t52);
    			append_dev(div1, p25);
    			append_dev(div1, t54);
    			append_dev(div1, p26);
    			append_dev(div1, t56);
    			append_dev(div1, p27);
    			append_dev(div1, t58);
    			append_dev(div1, p28);
    			append_dev(div1, t60);
    			append_dev(div1, p29);
    			append_dev(div1, t62);
    			append_dev(div1, p30);
    			append_dev(div1, t64);
    			append_dev(div1, p31);
    			append_dev(div1, t66);
    			append_dev(div1, p32);
    			append_dev(div1, t68);
    			append_dev(div1, p33);
    			append_dev(div1, t70);
    			append_dev(div1, p34);
    			append_dev(div1, t72);
    			append_dev(div1, p35);
    			append_dev(div1, t74);
    			append_dev(div1, p36);
    			append_dev(div1, t76);
    			append_dev(div1, p37);
    			append_dev(div1, t78);
    			append_dev(div1, p38);
    			append_dev(div1, t80);
    			append_dev(div1, p39);
    			append_dev(div1, t82);
    			append_dev(div1, p40);
    			append_dev(div1, t84);
    			append_dev(div1, p41);
    			append_dev(div1, t86);
    			append_dev(div1, p42);
    			append_dev(div1, t88);
    			append_dev(div1, p43);
    			append_dev(div1, t90);
    			append_dev(div1, p44);
    			append_dev(div1, t92);
    			append_dev(div1, p45);
    			append_dev(p45, br);
    			append_dev(div1, t93);
    			append_dev(div1, p46);
    			insert_dev(target, t95, anchor);
    			insert_dev(target, div3, anchor);
    			append_dev(div3, p47);
    			append_dev(p47, em0);
    			append_dev(p47, t97);
    			append_dev(p47, a);
    			append_dev(a, em1);
    			append_dev(p47, t99);
    			current = true;
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			const articleheader_changes = {};

    			if (!updating_audioActive && dirty & /*audioActive*/ 1) {
    				updating_audioActive = true;
    				articleheader_changes.audioActive = /*audioActive*/ ctx[0];
    				add_flush_callback(() => updating_audioActive = false);
    			}

    			articleheader.$set(articleheader_changes);
    			const audioplayer_changes = {};
    			if (dirty & /*audioActive*/ 1) audioplayer_changes.active = /*audioActive*/ ctx[0];
    			audioplayer.$set(audioplayer_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(articleheader.$$.fragment, local);
    			transition_in(audioplayer.$$.fragment, local);

    			add_render_callback(() => {
    				if (div2_outro) div2_outro.end(1);

    				if (!div2_intro) div2_intro = create_in_transition(div2, blur, {
    					delay: 50,
    					duration: 600,
    					amount: 8,
    					easing: identity
    				});

    				div2_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(articleheader.$$.fragment, local);
    			transition_out(audioplayer.$$.fragment, local);
    			if (div2_intro) div2_intro.invalidate();

    			div2_outro = create_out_transition(div2, blur, {
    				delay: 0,
    				duration: 400,
    				amount: 8,
    				easing: identity
    			});

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div2);
    			destroy_component(articleheader);
    			destroy_component(audioplayer);
    			if (detaching && div2_outro) div2_outro.end();
    			if (detaching) detach_dev(t95);
    			if (detaching) detach_dev(div3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Butterfly", slots, []);

    	onMount(() => {
    		document.title = "View Source | 'Butterfly' – Colm O'Shea";
    		let blobs = document.querySelectorAll(".blob");
    		[...blobs].forEach(el => move(el));
    		themeColour.update(theme => "#B4B5C0");

    		// headerOpacity.update((o) => 0.5);
    		// blob1.update((c) => "#936b6766");
    		blob2.update(c => "#9F738566");

    		// SVG Animation
    		let dh = document.querySelector(".text").getBoundingClientRect().height;

    		let line = document.querySelector("#line1");

    		document.addEventListener("scroll", () => {
    			requestAnimationFrame(() => {
    				let cy = window.scrollY;
    				line.style.strokeDashoffset = 1 - cy / dh;
    			});
    		});
    	});

    	let audioActive = false;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Butterfly> was created with unknown prop '${key}'`);
    	});

    	function articleheader_audioActive_binding(value) {
    		audioActive = value;
    		$$invalidate(0, audioActive);
    	}

    	$$self.$capture_state = () => ({
    		blur,
    		linear: identity,
    		onMount,
    		AudioPlayer,
    		ArticleHeader,
    		move,
    		themeColour,
    		blob2,
    		audioActive
    	});

    	$$self.$inject_state = $$props => {
    		if ("audioActive" in $$props) $$invalidate(0, audioActive = $$props.audioActive);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [audioActive, articleheader_audioActive_binding];
    }

    class Butterfly extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Butterfly",
    			options,
    			id: create_fragment$b.name
    		});
    	}
    }

    /* src/routes/pieces/OnlyJust.svelte generated by Svelte v3.32.3 */
    const file$a = "src/routes/pieces/OnlyJust.svelte";

    function create_fragment$c(ctx) {
    	let div0;
    	let iframe;
    	let iframe_src_value;
    	let t0;
    	let header;
    	let h1;
    	let t2;
    	let p0;
    	let t4;
    	let p1;
    	let t6;
    	let p2;
    	let t8;
    	let p3;
    	let header_intro;
    	let header_outro;
    	let t10;
    	let div1;
    	let p4;
    	let em;
    	let t12;
    	let a;
    	let t14;
    	let current;

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			iframe = element("iframe");
    			t0 = space();
    			header = element("header");
    			h1 = element("h1");
    			h1.textContent = "Πανδώρα";
    			t2 = space();
    			p0 = element("p");
    			p0.textContent = "ꬱ";
    			t4 = space();
    			p1 = element("p");
    			p1.textContent = "Ruby & Claire-Louise";
    			t6 = space();
    			p2 = element("p");
    			p2.textContent = "Ͼ Ϸ ϧ Ϣ Ϙ Φ Ϯ ω ͽ π α Ж Ђ Ќ Ϗ Ϩ Ϭ Д Ϫ";
    			t8 = space();
    			p3 = element("p");
    			p3.textContent = "Chloe Phil Sarah Mary Louise Róisín Suzanne Ruth Áine Jessamyn Alice Mary\n    Michal Karole Kate Sarah Anne Vicky Deborah";
    			t10 = space();
    			div1 = element("div");
    			p4 = element("p");
    			em = element("em");
    			em.textContent = "I Know, But Only Just";
    			t12 = text(" was first published in\n    ");
    			a = element("a");
    			a.textContent = "Winter Papers";
    			t14 = text(".");
    			if (iframe.src !== (iframe_src_value = "https://player.vimeo.com/video/523137788?autoplay=1&color=8a8a8a&title=0&byline=0&portrait=0&quality=4k")) attr_dev(iframe, "src", iframe_src_value);
    			attr_dev(iframe, "frameborder", "0");
    			attr_dev(iframe, "allow", "fullscreen; picture-in-picture");
    			attr_dev(iframe, "quality", "4k");
    			iframe.allowFullscreen = true;
    			attr_dev(iframe, "title", "00 Assembly_2");
    			attr_dev(iframe, "width", "1920");
    			attr_dev(iframe, "height", "1080");
    			attr_dev(iframe, "class", "svelte-21s92i");
    			add_location(iframe, file$a, 16, 2, 500);
    			attr_dev(div0, "class", "video-wrapper svelte-21s92i");
    			add_location(div0, file$a, 15, 0, 470);
    			attr_dev(h1, "class", "svelte-21s92i");
    			add_location(h1, file$a, 33, 2, 964);
    			attr_dev(p0, "class", "svelte-21s92i");
    			add_location(p0, file$a, 34, 2, 983);
    			attr_dev(p1, "class", "svelte-21s92i");
    			add_location(p1, file$a, 35, 2, 994);
    			attr_dev(p2, "class", "svelte-21s92i");
    			add_location(p2, file$a, 36, 2, 1028);
    			attr_dev(p3, "class", "svelte-21s92i");
    			add_location(p3, file$a, 38, 2, 1076);
    			attr_dev(header, "class", "invert svelte-21s92i");
    			add_location(header, file$a, 28, 0, 796);
    			add_location(em, file$a, 45, 4, 1267);
    			attr_dev(a, "href", "https://winterpapers.com/");
    			add_location(a, file$a, 46, 4, 1325);
    			add_location(p4, file$a, 44, 2, 1259);
    			attr_dev(div1, "class", "credits text invert svelte-21s92i");
    			add_location(div1, file$a, 43, 0, 1223);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, iframe);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, header, anchor);
    			append_dev(header, h1);
    			append_dev(header, t2);
    			append_dev(header, p0);
    			append_dev(header, t4);
    			append_dev(header, p1);
    			append_dev(header, t6);
    			append_dev(header, p2);
    			append_dev(header, t8);
    			append_dev(header, p3);
    			insert_dev(target, t10, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, p4);
    			append_dev(p4, em);
    			append_dev(p4, t12);
    			append_dev(p4, a);
    			append_dev(p4, t14);
    			current = true;
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (header_outro) header_outro.end(1);

    				if (!header_intro) header_intro = create_in_transition(header, blur, {
    					delay: 100,
    					duration: 800,
    					amount: 10,
    					easing: identity
    				});

    				header_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (header_intro) header_intro.invalidate();

    			header_outro = create_out_transition(header, blur, {
    				delay: 0,
    				duration: 600,
    				amount: 10,
    				easing: identity
    			});

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(header);
    			if (detaching && header_outro) header_outro.end();
    			if (detaching) detach_dev(t10);
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("OnlyJust", slots, []);

    	onMount(() => {
    		themeColour.update(c => "#222");
    		headerOpacity.update(o => 0.9);
    		blob1.update(b => "rgba(240,240,240,0.4)");
    		document.title = "View Source | 'I Know, But Only Just' – Ruby Wallis & Claire-Louise Bennett";
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<OnlyJust> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		blur,
    		linear: identity,
    		headerOpacity,
    		themeColour,
    		blob1,
    		onMount
    	});

    	return [];
    }

    class OnlyJust extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "OnlyJust",
    			options,
    			id: create_fragment$c.name
    		});
    	}
    }

    /* src/routes/pieces/Scarf.svelte generated by Svelte v3.32.3 */
    const file$b = "src/routes/pieces/Scarf.svelte";

    function create_fragment$d(ctx) {
    	let articleheader;
    	let updating_audioActive;
    	let t0;
    	let audioplayer;
    	let t1;
    	let div2;
    	let p0;
    	let t3;
    	let p1;
    	let t5;
    	let p2;
    	let t7;
    	let div1;
    	let div0;
    	let t8;
    	let p3;
    	let t10;
    	let p4;
    	let t11;
    	let em0;
    	let t13;
    	let em1;
    	let t15;
    	let em2;
    	let t17;
    	let em3;
    	let t19;
    	let t20;
    	let blockquote0;
    	let t22;
    	let p5;
    	let t24;
    	let p6;
    	let t26;
    	let p7;
    	let t28;
    	let p8;
    	let t30;
    	let p9;
    	let t32;
    	let p10;
    	let t34;
    	let p11;
    	let t36;
    	let p12;
    	let t38;
    	let blockquote1;
    	let t40;
    	let p13;
    	let t42;
    	let p14;
    	let t44;
    	let blockquote2;
    	let t46;
    	let p15;
    	let t48;
    	let p16;
    	let t50;
    	let p17;
    	let t52;
    	let p18;
    	let t54;
    	let p19;
    	let t56;
    	let p20;
    	let t58;
    	let p21;
    	let t60;
    	let p22;
    	let t62;
    	let p23;
    	let t64;
    	let p24;
    	let t66;
    	let p25;
    	let t68;
    	let p26;
    	let t70;
    	let p27;
    	let t72;
    	let p28;
    	let t74;
    	let p29;
    	let t76;
    	let p30;
    	let t78;
    	let p31;
    	let t80;
    	let p32;
    	let t82;
    	let p33;
    	let t84;
    	let p34;
    	let br;
    	let t85;
    	let p35;
    	let div2_intro;
    	let div2_outro;
    	let t87;
    	let div3;
    	let p36;
    	let em4;
    	let t89;
    	let em5;
    	let a;
    	let t91;
    	let t92;
    	let p37;
    	let t93;
    	let em6;
    	let t95;
    	let t96;
    	let p38;
    	let current;

    	function articleheader_audioActive_binding(value) {
    		/*articleheader_audioActive_binding*/ ctx[1](value);
    	}

    	let articleheader_props = {
    		title: "A Scarf",
    		author: "Doireann Ní Ghríofa"
    	};

    	if (/*audioActive*/ ctx[0] !== void 0) {
    		articleheader_props.audioActive = /*audioActive*/ ctx[0];
    	}

    	articleheader = new ArticleHeader({
    			props: articleheader_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(articleheader, "audioActive", articleheader_audioActive_binding));

    	audioplayer = new AudioPlayer({
    			props: {
    				src: "/assets/audio/electric.mp3",
    				active: /*audioActive*/ ctx[0],
    				credits: "Read by Vicky Langan."
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(articleheader.$$.fragment);
    			t0 = space();
    			create_component(audioplayer.$$.fragment);
    			t1 = space();
    			div2 = element("div");
    			p0 = element("p");
    			p0.textContent = "Last year, during long-delayed works on our home, our family struggled to\n    find anywhere to rent. My husband’s father agreed to lend us the\n    twenty-five-year-old campervan he had recently purchased. For an uncertain\n    number of months its three beds, chemical toilet, two-ring gas hob,\n    child-sized sink and mini-fridge would accommodate the six of us.";
    			t3 = space();
    			p1 = element("p");
    			p1.textContent = "We did our best to adapt. I took to loitering in the schoolyard long after\n    everyone else had left, so the children could play and shout and run. My\n    husband hauled our ancient washing machine onto a table in the garage and\n    improvised a rickety slide from old gutters and twine, rollercoastering suds\n    out to the drain. The van’s side window, slightly ajar, became our\n    letterbox; we thanked the postman through mouthfuls of cereal. I grew used\n    to fetching water from the fresh-water pipe that lay in the gravel outside,\n    but not to the stiff valve that always sprayed my shins, nor to the grit\n    that inevitably found its way into my coffee. It’s only for a few months, we\n    said, as the six of us showered in a local gym. Any time a cheap Airbnb\n    became available within a ninety-minute drive, we hurried to its heaters,\n    oven dinners and hot water – but such occasions were rare, and winter was\n    approaching.";
    			t5 = space();
    			p2 = element("p");
    			p2.textContent = "It grew cold. Storm clouds gathered; the van flinched from the gales. I\n    flinched too. No matter how long I bent over that small sink, scrubbing,\n    always scrubbing, our belongings felt grimy. If two of us stood upright at\n    once, the van felt intolerably crowded. I didn’t scream, but I often wanted\n    to. When I dug out our box of hats and gloves, I held the familiar darkness\n    of my favourite scarf to my face, inhaling deeply. It smelled like home. I\n    began to wear it all the time, taking it off only while I slept.";
    			t7 = space();
    			div1 = element("div");
    			div0 = element("div");
    			t8 = space();
    			p3 = element("p");
    			p3.textContent = "An invitation to spend the Halloween midterm at a friend’s empty cottage in\n    Mayo seemed too good to be true: a week of warm beds would be luxurious, not\n    to mention a dishwasher. There was something else, too: a half-remembered\n    family myth from Mayo. Stray threads began to come back to me as we drove\n    the tunnel deep under the Shannon. My young great-grandfather on the run;\n    soldiers surrounding a church while he was at mass; and his escape disguised\n    as a woman.";
    			t10 = space();
    			p4 = element("p");
    			t11 = text("In Clare we paused for lunch at my parents’ home. While the children\n    squabbled over pizza, I poked through bookshelves until I found what I was\n    looking for. The first folder had been compiled by my grandfather and\n    incorporated reminiscences of his own youth, a vast family tree, and\n    recollections of his father, Pádhraic Ó Gabhláin. Pádhraic was the subject\n    of the second folder too, a college project submitted by my mother as part\n    of her teacher training. This included an appendix of photocopied sources:\n    handwritten letters, old maps, obituaries, and copies of articles from the ");
    			em0 = element("em");
    			em0.textContent = "Freeman’s Journal";
    			t13 = text(", ");
    			em1 = element("em");
    			em1.textContent = "An Claidheamh Solais";
    			t15 = text(", the ");
    			em2 = element("em");
    			em2.textContent = "Western People";
    			t17 = text(", and the\n    ");
    			em3 = element("em");
    			em3.textContent = "Irish Independent";
    			t19 = text(". Having little time before we had to get back on\n    the road, I flicked through the obituaries until I found a trace of the\n    story I sought, documented in newsprint by his friend Aodh Ó Nualláin. The\n    obituary described events that had occurred one Sunday at Aghamore church in\n    east Mayo during the War of Independence, when ‘a company of military\n    arrived and surrounded the church’. Pádhraic – a member of what was\n    initially known as the Irish Volunteers and later as the IRA –");
    			t20 = space();
    			blockquote0 = element("blockquote");
    			blockquote0.textContent = "by dressing as a woman and walking out of the church with as much dignity as\n    possible among the women members of the congregation. Apparently there was\n    some delay in getting the proper fit in clothes and shoes, but the celebrant\n    of the mass, the late Reverend Father Garvey, was a staunch Republican, and\n    many in the congregation noticed that on that particular Sunday the prayers\n    after mass were unusually long.";
    			t22 = space();
    			p5 = element("p");
    			p5.textContent = "I wanted to know more, but it was nearly time to leave. I made a quick run\n    to the copy-shop and then hurried the folders back to the shelf.";
    			t24 = space();
    			p6 = element("p");
    			p6.textContent = "As we drove onwards to Mayo, I held my photocopies close. It was dark by the\n    time we found our way to the cottage, unpacked, and put the children to bed.\n    I poured a glass of wine, opened the documents, and began at the beginning.";
    			t26 = space();
    			p7 = element("p");
    			p7.textContent = "Born in 1892, Pádhraic left primary schooling to work on local farms and\n    bogs, travelling alongside his neighbours to labour seasonally in England.\n    This cluster of families had worked side by side for generations – the\n    Bolands, Greallys, Spellmans, and Forkans had been neighbours since\n    pre-Famine times, my grandfather wrote, their names marked on landlord’s\n    maps ‘of linen in Indian ink and watercolour with lists of tenants and\n    holdings’. He and his best friend Hugh Nolan (who, decades later, would sign\n    his obituary as Aodh Ó Nualláin) were sometimes overheard chatting about\n    characters from Dickens in terms so familiar that passers-by presumed they\n    were speaking of locals. Together, they started a pamphlet that was posted\n    from house to house, with each recipient filling an empty page with a new\n    story.";
    			t28 = space();
    			p8 = element("p");
    			p8.textContent = "The 1911 census noted that Pádhraic’s parents spoke both Irish and English,\n    whereas he and his siblings spoke English only. There, he was documented\n    under the name he grew up with: Patrick Forkan. Shortly thereafter, in his\n    early twenties, he and some friends were chatting by the roadside when a\n    passing teacher greeted the group casually in Irish. My great grandfather\n    felt such shame at his inability to reply that he began to attend Irish\n    classes. He quickly took to the language. Such was the demand among young\n    people wishing to do likewise at that time that anyone who had gained a\n    minimal fluency in Irish was asked to volunteer to instruct new students. In\n    those slapdash classrooms he found his vocation; and henceforth he always\n    used the Irish form of his name. Teaching was to become what Ó Nualláin’s\n    obituary described as ‘the pleasure of his life’. Beyond those classes, his\n    days were spent in farmwork, reading, and writing.";
    			t30 = space();
    			p9 = element("p");
    			p9.textContent = "By April 1917 Pádhraic was secretary of a local branch of Conradh na Gaeilge\n    and had established a company of the Irish Volunteers in Crossard.\n    Photographed at the Sinn Féin ardfheis with neat tie, crisp collar, and hair\n    swept to the side, he smiled with earnest eyes. He did not know what was to\n    come. No one did. I found that my own grasp of what was to come was lacking\n    too, so I turned to the internet to fill the gaps in my knowledge of the War\n    of Independence. By 1920, I read, attacks on the constabulary were growing\n    so common all over the country that supplementary forces were deployed. So\n    many of the Black and Tans and Auxiliaries arriving in Ballyhaunis had\n    fought in the First World War that the area in which they were billeted was\n    nicknamed ‘The Dardanelles’. Incidents of cruelty, drunken violence and\n    torture were soon reported across Mayo. In response, local resistance groups\n    grew, companies of the Irish Volunteers proliferated, and both ambushes and\n    retaliatory acts of violence intensified.";
    			t32 = space();
    			p10 = element("p");
    			p10.textContent = "Ó Nualláin noted that Pádhraic took a very active part in the organisation\n    of the Ballyhaunis Battalion, a fact that was apparently noticed by the\n    Occupation Forces of the area, for from early in the troubled times he\n    seemed to have attracted their particular attention. From documents captured\n    by the Dublin brigade and forwarded to the local volunteers it became clear\n    that he was a marked man, and he was obliged to go ‘on the run’ and remain\n    constantly on the alert.";
    			t34 = space();
    			p11 = element("p");
    			p11.textContent = "The next morning, I cleared the children’s breakfast bowls from the table\n    and searched groggily through the online archives of the Bureau of Military\n    History, hoping to find Pádhraic’s story recounted in his own words; but it\n    seems he did not provide testimony to the Bureau. I did find his name in\n    documentation from the Military Service Pensions Collection, dated 1935, in\n    which those who fought in Mayo battalions were listed retrospectively. His\n    name is among those recalled by Captain Seán Carney, who listed him as\n    Patrick Forkan of the 2nd Western Division, I Brigade (South Mayo), 5th\n    Battalion, B Company. Many of the surnames my grandfather had noted on local\n    pre-Famine maps were also listed in this company, suggesting that he was\n    among friends and neighbours.";
    			t36 = space();
    			p12 = element("p");
    			p12.textContent = "In the absence of a description in my great-grandfather’s own words, I\n    sought out accounts by the others. Ernie O’Malley’s oral history of the War\n    of Independence in Mayo was available online, and there I read how Johnny\n    Greally – a man who was born, grew up, lived, and fought by Pádhraic’s side\n    – described the day their commanding officer, Seán Corcoran, was murdered:";
    			t38 = space();
    			blockquote1 = element("blockquote");
    			blockquote1.textContent = "We heard that Curley’s house was to be burned, and we went to get rifles to\n    defend it. Seán and Maurice Mullins were supposed to call at this house, but\n    when he was coming over Seán ran into a patrol of Tans. His revolver jammed\n    at the first shot and he was shot dead, and Maurice, who was unarmed, was\n    beaten almost to death. They beat him there and they threw him in on top of\n    the dead Seán Corcoran in the turf house of the Barracks.";
    			t40 = space();
    			p13 = element("p");
    			p13.textContent = "Later that day, a sniper shot one of the Black and Tans in retaliation. As\n    vengeance, the Black and Tans murdered a local man named Michael Coen,\n    mutilating his corpse: ‘they cut off his private parts and pinned them on\n    his breast, and they cut the flesh of his legs and arms. They cut off his\n    ears and left him out on the road. They were night and day in that area in\n    Crossard townland, searching, for they must have had information. [...] The\n    people stiffened their resistance.’";
    			t42 = space();
    			p14 = element("p");
    			p14.textContent = "I do not know what part, if any, Pádhraic played in the events of that day,\n    but Greally’s account allowed me a glimpse of the environment in which he\n    was engaged. Pádhraic was one of many who survived by stealth in those\n    years, hurrying from safe-house to safe-house. His continued evasion of the\n    Black and Tans became a source of local bafflement. Ó Nualláin writes:";
    			t44 = space();
    			blockquote2 = element("blockquote");
    			blockquote2.textContent = "In spite of the special enemy attention he took part in all the activities\n    of the area and was never captured, although his many hairbreadth escapes\n    made him almost a legendary figure in his native district. On one occasion\n    when visiting his own home he was suddenly told that a large force of police\n    and military were surrounding the house. He slipped out, however, and\n    although the enemy opened fire, his knowledge of the country enabled him to\n    escape.";
    			t46 = space();
    			p15 = element("p");
    			p15.textContent = "Greally explained to Ernie O’Malley that their small group ‘had no arms save\n    shotguns. There were a couple of rifles but you couldn’t be sure of them. We\n    fired off ammunition from Seán Corcoran’s rifles, but only an odd round went\n    off. We had very few short arms.’ The best resource at their disposal was\n    the goodwill offered by neighbours, whether through shelter or sustenance.";
    			t48 = space();
    			p16 = element("p");
    			p16.textContent = "Within a month of Corcoran and Coen’s deaths, I read, the men found\n    themselves in peril again, having been traced to a remote area of bogland.\n    Greally described how the Black and Tans had information that we would be in\n    the bog, the six of us, myself and Paddy Boland, the company O/C, Pádhraic\n    Forkan, a Gaelic teacher, Austin Kenny and Jim Kilkelly. They wanted these\n    six of us. We were in a neighbour’s house where we used to stay, when Paddy\n    Mullins, the Brigadier, sent over bombs with me. The Master sent word to us\n    by a young lad, who came across the fields, and we had just time to get out.\n    They, the soldiers, fired shots, and they went into the house again, and\n    they bayoneted poor Paddy Boland who was an only son. They bursted the\n    bayonet in him and they almost cut his nose off with a bayonet also.";
    			t50 = space();
    			p17 = element("p");
    			p17.textContent = "The neighbour in whose house they had sheltered was my\n    great-great-grandmother: Pádhraic would marry her daughter. I remembered her\n    from a section of my grandfather’s reminiscences I’d read the night before,\n    a memorable passage that skipped from amusement to dread within a single\n    paragraph: My grandmother looked like a grandmother. She was fat and\n    comfortable and dressed in black. [...] She said very little about ‘the\n    troubles’. The only thing I remember was her account of the day when Paddy\n    Boland was shot. ‘The boys’ had run from her house as the troops approached\n    and scattered across the bog. Paddy Boland was shot dead a few hundred yards\n    from the house. She watched from a window as his body was carried on an\n    improvised stretcher covered in a blanket. It was only when she could see\n    the boots that she knew it was not one of her own sons.";
    			t52 = space();
    			p18 = element("p");
    			p18.textContent = "The date of Pádhraic’s escape from Aghamore church is not recorded in any\n    document I have seen; all we know for sure is that it must have happened\n    during the year and a half between the arrival of the Black and Tans in\n    Ireland, at the beginning of 1920, and the truce that was agreed in the\n    summer of 1921.";
    			t54 = space();
    			p19 = element("p");
    			p19.textContent = "After the truce, and the treaty, and the split in the republican movement,\n    Pádhraic couldn’t bring himself to participate in the civil war that com\n    menced in the summer of 1922. Another obituary, by C. Caimbhéal, noted that\n    ‘He was a respecter of valour and worth in any who had shown faith in their\n    cause. I recall his yearly buying of poppies from an ex-army captain on\n    Armistice Day. He was no bigot.’ He married. He wrote. He worked. His\n    children were born. He returned to his beloved books. He secured a job at\n    Ballyhaunis Vocational School, and filled his summers with further teaching\n    at Coláiste Chonnacht, in the heartlands of Conamara. He loved to read, to\n    write, to teach, and to laugh.";
    			t56 = space();
    			p20 = element("p");
    			p20.textContent = "My grandfather noted that ‘a straightforward description of my father’s\n    subsequent career might make him sound like a worthy, earnest and dull\n    character. This is as far from the truth as could be. One of the most\n    obvious things about him was his sense of humour – wild, anarchical humour\n    in his youth; warm and witty in his later years and never fully subdued by\n    old age.’ Reading this line, I wished that I could have heard him laugh.\n    When Pádhraic died in 1965, his coffin was draped in the tricolour, and his\n    surviving comrades, Johnny Greally among them, formed a guard of honour. A\n    passionate graveside oration was delivered by John P. Jordan. Of this\n    funeral, C. Caimbhéal wrote: ‘There were no tears on any face for it was the\n    honouring of a warrior, and none weep when a soldier sleeps when his fight\n    is over.’";
    			t58 = space();
    			p21 = element("p");
    			p21.textContent = "After closing the folders and all the tabs on my phone, I couldn’t stop\n    thinking about what I’d read. I woke that night thinking of how the young\n    Pádhraic had sent his little pamphlets from house to house, always including\n    empty pages in which recipients could add a new story. So far, his son and\n    granddaughter and several obituarists had filled pages with their writings\n    on his life; perhaps I could add a page, too. ‘Cloch le carn’ is the phrase\n    used for the traditional act of adding one’s own stone to a cairn made in\n    memory of another. Rather than a cairn, however, I found myself thinking of\n    the story as a beloved scarf, a garment whose stitches I had already begun\n    to unpick into a soft mass of unravelled facts. As a girl, the story of his\n    escape from Aghamore church had seemed a neatly woven tale of adventure,\n    prudently tailored to a child’s ears: no torn flesh, no torture, no terror.\n    Now that the dark red of Greally’s voice had seeped in, however, there could\n    be no erasing it. I wondered what other threads might add themselves as I\n    set upon knitting my own telling of it.";
    			t60 = space();
    			p22 = element("p");
    			p22.textContent = "It was this curiosity that led me to bring the whole family to the church at\n    Aghamore the following day. We are not a family of mass-goers, and I can’t\n    recall how I sold them on this road trip. As soon as we parked, I hurried\n    ahead, certain that I wouldn’t have much time before the kids lost patience,\n    before pausing in the porch, suddenly nervous. I would be alone, if only for\n    the length of time it took my husband to wrestle coats and hats onto our\n    children. A residual whiff of sanctity haunted the air. My breath was short\n    and growing shorter – I had wound my scarf too well, I realized, tucking a\n    finger between fabric and throat until it gave a little. I drank a deep\n    lungful and watched my breath hurry away, a small fog, or a ghost: glimpsed,\n    then gone. I pushed the door and stepped into the story.";
    			t62 = space();
    			p23 = element("p");
    			p23.textContent = "The church was empty. I moved quickly up the aisle, snapshotting details on\n    my phone as I went: a statue, an altar cloth, a dent worn into the floor by\n    many decades of footfall. Outside, clouds broke and blew; when shards of\n    sunlight met stained-glass eyes, I wondered whether those glassy faces had\n    felt alive to my great-grandfather, too. Above my head, the intricately\n    crafted timber roof was neat as a ribcage. All his life, Pádhraic returned\n    to pray here, surrounding himself with the same people, all standing and\n    kneeling in unison, their voices murmuring a warm chorus around his.\n    Together and alone, they aged. Theirs were the eyes that met his in worship,\n    on feast days, at funerals and baptisms, on the day he escaped from the\n    Crown forces, and on his wedding day.";
    			t64 = space();
    			p24 = element("p");
    			p24.textContent = "My children flung open the door and galloped toward me, raucous as ever,\n    with coats flapping open, hats and scarves forgotten, shouldering into each\n    other, giggling and squabbling, their cheeks already reddened by cold. I\n    rolled my eyes at my husband – it is a running joke between us that while I\n    mollycoddle the children with mittens and vests and thermal underwear, he\n    believes that a little cold will toughen them. Sitting in the pew with a\n    child on each knee and another in each elbow, I began to adjust the story\n    for their ears; but soon they were whingeing for the car. The only one who\n    insisted on staying was the boy who always stays by my side when I lead my\n    family on such jaunts, the child who at seven is skinny and bold and bright\n    and always fights to hold my hand. I continued to photograph the little\n    details that surrounded us, and that had once surrounded Pádhraic: the\n    dinged brass of the altar bells, the dark lustre of the confessional box,\n    the altar that had never figured in my imaginings until its inscription\n    loomed before me. Sanctus, Sanctus, Sanctus: a male figure was carved there,\n    each fold of his gown whittled from cold stone. Holy, Holy.";
    			t66 = space();
    			p25 = element("p");
    			p25.textContent = "Only when my son whispered ‘I’m cold, Mám,’ did I notice that his coat had\n    been forgotten altogether. I was glad of the warmth my body had pressed into\n    the weft of my scarf as I wound it into a pullover of sorts, criss-crossing\n    its endings into his waistband: snug. I pressed my lips to his forehead and\n    on we went with my hand in his, or his in mine. When he asked what we were\n    looking for, I couldn’t answer because I didn’t know, beyond the sense that\n    he and I had entered the story, and now we had to find our way towards some\n    sort of an ending. Perhaps the gesture of leaving a little flame in our wake\n    might do it? No, all the wicks were unlit, and I could see no matches.";
    			t68 = space();
    			p26 = element("p");
    			p26.textContent = "My son shrugged and asked me to finish telling the story, and I did, and was\n    surprised on approaching the ending to find myself saying, ‘and if it\n    weren’t for that moment, would we be here today, you and me?’";
    			t70 = space();
    			p27 = element("p");
    			p27.textContent = "I was smiling as I turned towards the door, until my son broke away to dash\n    a giddy circuit of the room, hee-hawing the chorus of ‘Old Town Road’ and\n    cackling over his shoulder. From the porch I called to him in exasperation,\n    then called again, my voice growing colder now, cold and cranky. While I\n    waited, I lined up one last photo of the aisle, the door ajar to show its\n    neat symmetry of empty pews; but just as I got the framing right, my son\n    hurtled through the shot, blurring past me and sprinting out towards the\n    car. Little trespasser. I arranged the photo again, and then turned to catch\n    up with him. The door of the church thumped heavily behind us.";
    			t72 = space();
    			p28 = element("p");
    			p28.textContent = "In the car, my husband was thumbing his phone and the children were munching\n    chocolate biscuits. I felt satisfied as I clicked my seatbelt – seeing this\n    place felt like some small achievement to show for our cold months away from\n    home. But back in the cottage, I couldn’t sleep for incessant fidgeting: the\n    story wouldn’t rest. If I couldn’t hear the story of this escape in\n    Pádhraic’s own voice, then maybe there was a way to hear it in the voice of\n    one who had stood by him. My mother had once heard a man on the radio\n    describe how, long ago, his grandmother had disguised a man at mass to save\n    him from the Black and Tans. She had made a note of the man’s name. Tadhg\n    Mac Dhonnagáin was a publisher of Irish-language books, and I knew him a\n    little from Twitter. He lived in Conamara, only an hour and a half or so\n    away. I found his email address. I told him that I wanted to know how this\n    story had been told in his childhood.";
    			t74 = space();
    			p29 = element("p");
    			p29.textContent = "In the Buillín Blasta café in An Spidéal, Tadhg described his grandmother,\n    Annie Kenny: a bright young woman who had been awarded a teacher-training\n    scholarship in Belfast, but still travelled home at weekends to lead the\n    church choir. The story he had inherited began there, with a young woman\n    leading a chorus of voices, called to a sudden act of courage, then hurrying\n    to save a life. It was a tale he had treasured as a child, Tadhg said, and\n    he told it beautifully: Annie’s quick thinking, her gathering of garments,\n    her supervision of the disguise, her palms rubbing distemper from the walls\n    to press on Pádhraic’s cheeks. His favourite part of all, he said, was the\n    importance placed on one detail: the height of the women chosen to escort\n    him to safety. Those women: they were tall.";
    			t76 = space();
    			p30 = element("p");
    			p30.textContent = "I thanked Tadhg for his time, wound myself back into my scarf and rummaged\n    my car keys from my handbag. Driving back to Mayo, between mountains and\n    bogs, over stone bridges and boreens, I pictured Annie on the church\n    mezzanine, her hair braided and pinned high, her face among the crowd in the\n    choir, alive and afraid. A wild, fearful whisper was flying through the\n    church below. She watched as one person whispered in dread to the next: they\n    were surrounded. The soldiers were outside with their guns.";
    			t78 = space();
    			p31 = element("p");
    			p31.textContent = "When the whisper reached Pádhraic’s ear, I imagine that he sat in silence a\n    moment, assessing his predicament and that of the people around him. There\n    were elderly people present, women, and children. If he surrendered, might\n    others be spared?";
    			t80 = space();
    			p32 = element("p");
    			p32.textContent = "The priest, knowing these soldiers as brutally violent and unpredictable,\n    bought time by lengthening the prayers. Annie hurried down from the choir\n    and gathered garments: a dark shawl here, a skirt there, perhaps a blouse.\n    Pádhraic was urged to his feet and dressed. Palms were pressed to damp\n    walls, and then to the shadow of his stubble. A black shawl was drawn over\n    the crest of his skull, quick as a shadow. The priest drew the prayers to\n    their end. The two tallest women stood by him, arm in arm, their trio folded\n    within the close crowd. Elbows trembled. Down the aisle they all went, out\n    the door, past the soldiers. Eyes lowered. Jaws tight. No flinching. A\n    procession of bodies leaving the church gates and walking steadily away:\n    almost an ordinary sight. On this Sunday, everyone leaves alive. The End.";
    			t82 = space();
    			p33 = element("p");
    			p33.textContent = "Exhilarated and weary from driving, I fell into bed early, but my heart\n    raced, and my toes twitched: too much coffee. Eventually I fumbled my phone\n    from where it was charging on the floor and swiped idly through photos of\n    our trip: playgrounds, mountains, the gift of a barmbrack, Harry Clarke\n    windows in Ballinrobe, a little dog called Marcie. I came to the penultimate\n    photo I’d taken in the church, the one that had vexed me when my son flung\n    himself through it. I zoomed in by fingertip. There was the aisle, along\n    which a male shadow hurried. By the next photo the aisle was empty. How\n    brief, his presence: glimpsed, then gone. When I swiped back, though, he\n    reappeared, wrapped again in a borrowed shawl, folded into the fabric of\n    that inherited story – too big and too dark – in which we all find ourselves\n    bound by those who came before us.";
    			t84 = space();
    			p34 = element("p");
    			br = element("br");
    			t85 = space();
    			p35 = element("p");
    			p35.textContent = "⁙";
    			t87 = space();
    			div3 = element("div");
    			p36 = element("p");
    			em4 = element("em");
    			em4.textContent = "A Scarf";
    			t89 = text(", written by Doireann Ní Ghríofa, was first published in\n    ");
    			em5 = element("em");
    			a = element("a");
    			a.textContent = "The Dublin Review";
    			t91 = text(".");
    			t92 = space();
    			p37 = element("p");
    			t93 = text("Doireann Ní Ghríofa is a poet and essayist. ");
    			em6 = element("em");
    			em6.textContent = "A Ghost in the Throat";
    			t95 = text(" was\n    awarded Book of the Year at the Irish Book Awards, and described as “glowing”\n    (Anne Enright), “spellbinding” (Joseph O’Connor), “gorgeous” (Lauren Elkin),\n    “captivatingly original”​​ (The Guardian), “sumptuous” (The Sunday Times), and\n    a “masterpiece” (Sunday Business Post).");
    			t96 = space();
    			p38 = element("p");
    			p38.textContent = "Doireann is also author of six critically-acclaimed books of poetry, each a\n    deepening exploration of birth, death, desire, and domesticity. Awards for\n    her writing include a Lannan Literary Fellowship (USA), the Ostana Prize\n    (Italy), a Seamus Heaney Fellowship (Queen’s University), and the Rooney\n    Prize for Irish Literature, among others.";
    			add_location(p0, file$b, 39, 2, 1134);
    			add_location(p1, file$b, 46, 2, 1515);
    			add_location(p2, file$b, 61, 2, 2480);
    			attr_dev(div0, "class", "pane svelte-fwbeod");
    			add_location(div0, file$b, 71, 4, 3058);
    			attr_dev(div1, "class", "window svelte-fwbeod");
    			add_location(div1, file$b, 70, 2, 3033);
    			add_location(p3, file$b, 73, 2, 3090);
    			add_location(em0, file$b, 90, 79, 4218);
    			add_location(em1, file$b, 92, 7, 4258);
    			add_location(em2, file$b, 92, 42, 4293);
    			add_location(em3, file$b, 93, 4, 4330);
    			add_location(p4, file$b, 82, 2, 3595);
    			add_location(blockquote0, file$b, 101, 2, 4867);
    			add_location(p5, file$b, 109, 2, 5335);
    			add_location(p6, file$b, 113, 2, 5496);
    			add_location(p7, file$b, 118, 2, 5751);
    			add_location(p8, file$b, 132, 2, 6627);
    			add_location(p9, file$b, 147, 2, 7636);
    			add_location(p10, file$b, 163, 2, 8721);
    			add_location(p11, file$b, 172, 2, 9236);
    			add_location(p12, file$b, 185, 2, 10068);
    			add_location(blockquote1, file$b, 192, 2, 10475);
    			add_location(p13, file$b, 200, 2, 10970);
    			add_location(p14, file$b, 209, 2, 11492);
    			add_location(blockquote2, file$b, 216, 2, 11897);
    			add_location(p15, file$b, 225, 2, 12411);
    			add_location(p16, file$b, 232, 2, 12825);
    			add_location(p17, file$b, 245, 2, 13695);
    			add_location(p18, file$b, 259, 2, 14609);
    			add_location(p19, file$b, 266, 2, 14950);
    			add_location(p20, file$b, 278, 2, 15704);
    			add_location(p21, file$b, 292, 2, 16586);
    			add_location(p22, file$b, 309, 2, 17750);
    			add_location(p23, file$b, 322, 2, 18617);
    			add_location(p24, file$b, 335, 2, 19451);
    			add_location(p25, file$b, 353, 2, 20700);
    			add_location(p26, file$b, 364, 2, 21429);
    			add_location(p27, file$b, 369, 2, 21663);
    			add_location(p28, file$b, 380, 2, 22371);
    			add_location(p29, file$b, 395, 2, 23368);
    			add_location(p30, file$b, 408, 2, 24220);
    			add_location(p31, file$b, 417, 2, 24764);
    			add_location(p32, file$b, 423, 2, 25038);
    			add_location(p33, file$b, 436, 2, 25909);
    			add_location(br, file$b, 450, 5, 26822);
    			add_location(p34, file$b, 450, 2, 26819);
    			set_style(p35, "text-align", "center");
    			add_location(p35, file$b, 451, 2, 26835);
    			attr_dev(div2, "class", "text");
    			add_location(div2, file$b, 34, 0, 971);
    			add_location(em4, file$b, 456, 4, 26923);
    			attr_dev(a, "href", "https://thedublinreview.com/");
    			add_location(a, file$b, 457, 8, 27004);
    			add_location(em5, file$b, 457, 4, 27000);
    			add_location(p36, file$b, 455, 2, 26915);
    			add_location(em6, file$b, 460, 48, 27132);
    			add_location(p37, file$b, 459, 2, 27080);
    			add_location(p38, file$b, 466, 2, 27466);
    			attr_dev(div3, "class", "credits text svelte-fwbeod");
    			add_location(div3, file$b, 454, 0, 26886);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(articleheader, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(audioplayer, target, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div2, anchor);
    			append_dev(div2, p0);
    			append_dev(div2, t3);
    			append_dev(div2, p1);
    			append_dev(div2, t5);
    			append_dev(div2, p2);
    			append_dev(div2, t7);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			append_dev(div2, t8);
    			append_dev(div2, p3);
    			append_dev(div2, t10);
    			append_dev(div2, p4);
    			append_dev(p4, t11);
    			append_dev(p4, em0);
    			append_dev(p4, t13);
    			append_dev(p4, em1);
    			append_dev(p4, t15);
    			append_dev(p4, em2);
    			append_dev(p4, t17);
    			append_dev(p4, em3);
    			append_dev(p4, t19);
    			append_dev(div2, t20);
    			append_dev(div2, blockquote0);
    			append_dev(div2, t22);
    			append_dev(div2, p5);
    			append_dev(div2, t24);
    			append_dev(div2, p6);
    			append_dev(div2, t26);
    			append_dev(div2, p7);
    			append_dev(div2, t28);
    			append_dev(div2, p8);
    			append_dev(div2, t30);
    			append_dev(div2, p9);
    			append_dev(div2, t32);
    			append_dev(div2, p10);
    			append_dev(div2, t34);
    			append_dev(div2, p11);
    			append_dev(div2, t36);
    			append_dev(div2, p12);
    			append_dev(div2, t38);
    			append_dev(div2, blockquote1);
    			append_dev(div2, t40);
    			append_dev(div2, p13);
    			append_dev(div2, t42);
    			append_dev(div2, p14);
    			append_dev(div2, t44);
    			append_dev(div2, blockquote2);
    			append_dev(div2, t46);
    			append_dev(div2, p15);
    			append_dev(div2, t48);
    			append_dev(div2, p16);
    			append_dev(div2, t50);
    			append_dev(div2, p17);
    			append_dev(div2, t52);
    			append_dev(div2, p18);
    			append_dev(div2, t54);
    			append_dev(div2, p19);
    			append_dev(div2, t56);
    			append_dev(div2, p20);
    			append_dev(div2, t58);
    			append_dev(div2, p21);
    			append_dev(div2, t60);
    			append_dev(div2, p22);
    			append_dev(div2, t62);
    			append_dev(div2, p23);
    			append_dev(div2, t64);
    			append_dev(div2, p24);
    			append_dev(div2, t66);
    			append_dev(div2, p25);
    			append_dev(div2, t68);
    			append_dev(div2, p26);
    			append_dev(div2, t70);
    			append_dev(div2, p27);
    			append_dev(div2, t72);
    			append_dev(div2, p28);
    			append_dev(div2, t74);
    			append_dev(div2, p29);
    			append_dev(div2, t76);
    			append_dev(div2, p30);
    			append_dev(div2, t78);
    			append_dev(div2, p31);
    			append_dev(div2, t80);
    			append_dev(div2, p32);
    			append_dev(div2, t82);
    			append_dev(div2, p33);
    			append_dev(div2, t84);
    			append_dev(div2, p34);
    			append_dev(p34, br);
    			append_dev(div2, t85);
    			append_dev(div2, p35);
    			insert_dev(target, t87, anchor);
    			insert_dev(target, div3, anchor);
    			append_dev(div3, p36);
    			append_dev(p36, em4);
    			append_dev(p36, t89);
    			append_dev(p36, em5);
    			append_dev(em5, a);
    			append_dev(p36, t91);
    			append_dev(div3, t92);
    			append_dev(div3, p37);
    			append_dev(p37, t93);
    			append_dev(p37, em6);
    			append_dev(p37, t95);
    			append_dev(div3, t96);
    			append_dev(div3, p38);
    			current = true;
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			const articleheader_changes = {};

    			if (!updating_audioActive && dirty & /*audioActive*/ 1) {
    				updating_audioActive = true;
    				articleheader_changes.audioActive = /*audioActive*/ ctx[0];
    				add_flush_callback(() => updating_audioActive = false);
    			}

    			articleheader.$set(articleheader_changes);
    			const audioplayer_changes = {};
    			if (dirty & /*audioActive*/ 1) audioplayer_changes.active = /*audioActive*/ ctx[0];
    			audioplayer.$set(audioplayer_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(articleheader.$$.fragment, local);
    			transition_in(audioplayer.$$.fragment, local);

    			add_render_callback(() => {
    				if (div2_outro) div2_outro.end(1);

    				if (!div2_intro) div2_intro = create_in_transition(div2, blur, {
    					delay: 100,
    					duration: 800,
    					amount: 10,
    					easing: identity
    				});

    				div2_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(articleheader.$$.fragment, local);
    			transition_out(audioplayer.$$.fragment, local);
    			if (div2_intro) div2_intro.invalidate();

    			div2_outro = create_out_transition(div2, blur, {
    				delay: 0,
    				duration: 600,
    				amount: 10,
    				easing: identity
    			});

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(articleheader, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(audioplayer, detaching);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div2);
    			if (detaching && div2_outro) div2_outro.end();
    			if (detaching) detach_dev(t87);
    			if (detaching) detach_dev(div3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Scarf", slots, []);

    	onMount(() => {
    		document.title = "View Source | 'A Scarf' – Doireann Ní Ghríofa";
    		let blobs = document.querySelectorAll(".blob");
    		[...blobs].forEach(el => move(el));
    		themeColour.update(theme => "#CED1CE");
    		headerOpacity.update(o => 0.5);
    		blob1.update(c => "#936b6766");
    		blob2.update(c => "#1f38348c");
    	});

    	//
    	let audioActive = false;

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Scarf> was created with unknown prop '${key}'`);
    	});

    	function articleheader_audioActive_binding(value) {
    		audioActive = value;
    		$$invalidate(0, audioActive);
    	}

    	$$self.$capture_state = () => ({
    		blur,
    		linear: identity,
    		AudioPlayer,
    		ArticleHeader,
    		onMount,
    		themeColour,
    		headerOpacity,
    		blob1,
    		blob2,
    		move,
    		audioActive
    	});

    	$$self.$inject_state = $$props => {
    		if ("audioActive" in $$props) $$invalidate(0, audioActive = $$props.audioActive);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [audioActive, articleheader_audioActive_binding];
    }

    class Scarf extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Scarf",
    			options,
    			id: create_fragment$d.name
    		});
    	}
    }

    /* src/routes/pieces/SaintSisters.svelte generated by Svelte v3.32.3 */
    const file$c = "src/routes/pieces/SaintSisters.svelte";

    function create_fragment$e(ctx) {
    	let articleheader;
    	let updating_audioActive;
    	let t0;
    	let audioplayer;
    	let t1;
    	let div0;
    	let section0;
    	let p0;
    	let t3;
    	let p1;
    	let t5;
    	let p2;
    	let t7;
    	let p3;
    	let t9;
    	let section1;
    	let p4;
    	let t11;
    	let p5;
    	let t13;
    	let section2;
    	let p6;
    	let t15;
    	let p7;
    	let strong0;
    	let br0;
    	let t17;
    	let br1;
    	let em0;
    	let br2;
    	let t19;
    	let t20;
    	let section3;
    	let p8;
    	let t22;
    	let p9;
    	let t24;
    	let p10;
    	let t26;
    	let p11;
    	let t28;
    	let section4;
    	let p12;
    	let t30;
    	let p13;
    	let strong1;
    	let t31;
    	let br3;
    	let t32;
    	let t33;
    	let p14;
    	let t35;
    	let p15;
    	let t37;
    	let section5;
    	let p16;
    	let t39;
    	let p17;
    	let t41;
    	let p18;
    	let t43;
    	let p19;
    	let t45;
    	let p20;
    	let t47;
    	let p21;
    	let t49;
    	let p22;
    	let t50;
    	let em1;
    	let t52;
    	let img0;
    	let img0_src_value;
    	let t53;
    	let section6;
    	let p23;
    	let t55;
    	let p24;
    	let t56;
    	let em2;
    	let t58;
    	let em3;
    	let t60;
    	let em4;
    	let t62;
    	let t63;
    	let section7;
    	let p25;
    	let t65;
    	let p26;
    	let t67;
    	let section8;
    	let p27;
    	let t69;
    	let p28;
    	let t71;
    	let p29;
    	let t73;
    	let section9;
    	let p30;
    	let t75;
    	let p31;
    	let t77;
    	let section10;
    	let p32;
    	let t79;
    	let p33;
    	let t81;
    	let p34;
    	let t83;
    	let img1;
    	let img1_src_value;
    	let t84;
    	let section11;
    	let p35;
    	let t86;
    	let p36;
    	let t87;
    	let em5;
    	let t89;
    	let em6;
    	let t91;
    	let em7;
    	let t93;
    	let t94;
    	let p37;
    	let t96;
    	let p38;
    	let t98;
    	let p39;
    	let t100;
    	let section12;
    	let p40;
    	let t102;
    	let p41;
    	let t104;
    	let p42;
    	let t106;
    	let p43;
    	let t108;
    	let p44;
    	let t110;
    	let section13;
    	let p45;
    	let t112;
    	let p46;
    	let t114;
    	let p47;
    	let t116;
    	let p48;
    	let t118;
    	let p49;
    	let t120;
    	let section14;
    	let p50;
    	let t122;
    	let p51;
    	let em8;
    	let br4;
    	let t124;
    	let br5;
    	let strong2;
    	let br6;
    	let em9;
    	let t127;
    	let p52;
    	let t129;
    	let p53;
    	let t131;
    	let p54;
    	let t133;
    	let p55;
    	let t135;
    	let img2;
    	let img2_src_value;
    	let t136;
    	let section15;
    	let p56;
    	let t138;
    	let p57;
    	let t139;
    	let em10;
    	let t141;
    	let em11;
    	let t143;
    	let t144;
    	let section16;
    	let p58;
    	let t146;
    	let p59;
    	let t148;
    	let p60;
    	let t150;
    	let p61;
    	let t152;
    	let section17;
    	let p62;
    	let t154;
    	let p63;
    	let t156;
    	let ul;
    	let li0;
    	let t158;
    	let li1;
    	let t160;
    	let li2;
    	let t162;
    	let li3;
    	let t164;
    	let li4;
    	let t166;
    	let p64;
    	let t168;
    	let p65;
    	let t170;
    	let section18;
    	let p66;
    	let t172;
    	let p67;
    	let t174;
    	let p68;
    	let t176;
    	let p69;
    	let t178;
    	let p70;
    	let t180;
    	let p71;
    	let t182;
    	let p72;
    	let t184;
    	let section19;
    	let p73;
    	let t186;
    	let p74;
    	let strong3;
    	let t188;
    	let ol;
    	let li5;
    	let t190;
    	let li6;
    	let t192;
    	let li7;
    	let t194;
    	let li8;
    	let t196;
    	let li9;
    	let t198;
    	let li10;
    	let t200;
    	let li11;
    	let t202;
    	let li12;
    	let t204;
    	let li13;
    	let t206;
    	let img3;
    	let img3_src_value;
    	let t207;
    	let section20;
    	let p75;
    	let t209;
    	let p76;
    	let t211;
    	let p77;
    	let t213;
    	let p78;
    	let t214;
    	let em12;
    	let t216;
    	let t217;
    	let p79;
    	let t219;
    	let section21;
    	let p80;
    	let t221;
    	let p81;
    	let t223;
    	let section22;
    	let p82;
    	let t225;
    	let p83;
    	let t227;
    	let p84;
    	let t229;
    	let p85;
    	let t230;
    	let em13;
    	let t232;
    	let t233;
    	let p86;
    	let t234;
    	let em14;
    	let t236;
    	let p87;
    	let t238;
    	let p88;
    	let t240;
    	let section23;
    	let p89;
    	let t242;
    	let p90;
    	let t244;
    	let p91;
    	let t246;
    	let p92;
    	let t248;
    	let p93;
    	let t250;
    	let p94;
    	let t252;
    	let p95;
    	let t254;
    	let section24;
    	let p96;
    	let t256;
    	let p97;
    	let t258;
    	let p98;
    	let t260;
    	let img4;
    	let img4_src_value;
    	let t261;
    	let section25;
    	let p99;
    	let t263;
    	let p100;
    	let t264;
    	let p101;
    	let t266;
    	let p102;
    	let t267;
    	let em15;
    	let t269;
    	let p103;
    	let t271;
    	let p104;
    	let t273;
    	let p105;
    	let t275;
    	let p106;
    	let t277;
    	let p107;
    	let t279;
    	let p108;
    	let t281;
    	let p109;
    	let t283;
    	let p110;
    	let t285;
    	let p111;
    	let t287;
    	let p112;
    	let t289;
    	let section26;
    	let p113;
    	let t291;
    	let p114;
    	let t292;
    	let em16;
    	let t294;
    	let t295;
    	let p115;
    	let t297;
    	let p116;
    	let t299;
    	let p117;
    	let t300;
    	let em17;
    	let t302;
    	let t303;
    	let p118;
    	let t305;
    	let p119;
    	let t307;
    	let p120;
    	let t309;
    	let p121;
    	let t311;
    	let p122;
    	let t313;
    	let p123;
    	let t315;
    	let p124;
    	let t317;
    	let p125;
    	let t319;
    	let p126;
    	let t321;
    	let section27;
    	let p127;
    	let t323;
    	let p128;
    	let t325;
    	let p129;
    	let t327;
    	let p130;
    	let t329;
    	let section28;
    	let p131;
    	let t331;
    	let p132;
    	let t333;
    	let img5;
    	let img5_src_value;
    	let t334;
    	let section29;
    	let p133;
    	let t336;
    	let p134;
    	let t338;
    	let p135;
    	let t340;
    	let p136;
    	let t342;
    	let p137;
    	let t344;
    	let p138;
    	let t346;
    	let p139;
    	let t348;
    	let p140;
    	let t350;
    	let p141;
    	let br7;
    	let t351;
    	let p142;
    	let div0_intro;
    	let div0_outro;
    	let t353;
    	let div1;
    	let p143;
    	let em18;
    	let t355;
    	let em19;
    	let a0;
    	let t357;
    	let t358;
    	let p144;
    	let t359;
    	let em20;
    	let t361;
    	let em21;
    	let t363;
    	let em22;
    	let t365;
    	let em23;
    	let t367;
    	let em24;
    	let t369;
    	let t370;
    	let p145;
    	let t372;
    	let p146;
    	let a1;
    	let current;

    	function articleheader_audioActive_binding(value) {
    		/*articleheader_audioActive_binding*/ ctx[1](value);
    	}

    	let articleheader_props = {
    		title: "Saint Sisters & The Sea",
    		author: "Méabh de Brún"
    	};

    	if (/*audioActive*/ ctx[0] !== void 0) {
    		articleheader_props.audioActive = /*audioActive*/ ctx[0];
    	}

    	articleheader = new ArticleHeader({
    			props: articleheader_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(articleheader, "audioActive", articleheader_audioActive_binding));

    	audioplayer = new AudioPlayer({
    			props: {
    				src: "/assets/audio/saint-sisters.mp3",
    				active: /*audioActive*/ ctx[0],
    				credits: "Read by Méabh de Brún."
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(articleheader.$$.fragment);
    			t0 = space();
    			create_component(audioplayer.$$.fragment);
    			t1 = space();
    			div0 = element("div");
    			section0 = element("section");
    			p0 = element("p");
    			p0.textContent = "1.";
    			t3 = space();
    			p1 = element("p");
    			p1.textContent = "When your sister goes missing you are twenty-seven years old. She had just\n      turned thirty. One day she was there, the next day she was Gone. It was\n      three days before anyone realized; it happened on a Friday and she had\n      just moved to Wicklow Town. She was after nabbing a tidy number as the\n      local orthodontist, wearing tidy white scrubs and sorting people’s teeth\n      into tidy white rows.";
    			t5 = space();
    			p2 = element("p");
    			p2.textContent = "You usually rang her every evening, but she had been a bit of a downer\n      lately, what with the new town, new job, no friends. A manageable downer\n      though. Run of the mill stuff. No alarm bells. But you were tired, and\n      reluctant to take on her woes.";
    			t7 = space();
    			p3 = element("p");
    			p3.textContent = "Somewhere deep in the pit of your stomach you know this is your fault.\n      Your calls were the talisman that kept the Gone at bay.";
    			t9 = space();
    			section1 = element("section");
    			p4 = element("p");
    			p4.textContent = "2.";
    			t11 = space();
    			p5 = element("p");
    			p5.textContent = "The worst thing is that everyone around you expects life to go on, and\n      they expect you to go on too, so you do. Not because you think it’s right\n      or because you want to, but because you accede to their beliefs and are\n      loath to cause discomfort.";
    			t13 = space();
    			section2 = element("section");
    			p6 = element("p");
    			p6.textContent = "3.";
    			t15 = space();
    			p7 = element("p");
    			strong0 = element("strong");
    			strong0.textContent = "Actuary";
    			br0 = element("br");
    			t17 = text("/ˈaktʃʊ(ə)ri/ ");
    			br1 = element("br");
    			em0 = element("em");
    			em0.textContent = "noun";
    			br2 = element("br");
    			t19 = text(" An actuary\n      is someone that analyses data and works with statistics, using mathematical\n      skill to assess or predict the probability of an uncertain future event.");
    			t20 = space();
    			section3 = element("section");
    			p8 = element("p");
    			p8.textContent = "4.";
    			t22 = space();
    			p9 = element("p");
    			p9.textContent = "You’re the middle sister. You were three years younger than Becca; you are\n      three years older than Niamh. You never quite clicked with Niamh beyond\n      the dutiful clicking that comes with unavoidably shared genes and\n      reluctantly shared jeans.";
    			t24 = space();
    			p10 = element("p");
    			p10.textContent = "Niamh isn’t doing well. She’s a tightly coiled spring over an open flame.\n      She has a scalding tongue on her, ready to snap at any stage. Her\n      targetless anger floods out like waves of acid, burning friends and family\n      alike. On some level you know that she’s pushing out what you’re turning\n      in. She calls you Bean Uí Robot with a sneer on her lips.";
    			t26 = space();
    			p11 = element("p");
    			p11.textContent = "How can you tell her that you’ve run out of responses? That you are sick\n      of receiving condolences for something that is not a death, not an ending.\n      Something that just goes on and on, forever and ever without end amen.";
    			t28 = space();
    			section4 = element("section");
    			p12 = element("p");
    			p12.textContent = "5.";
    			t30 = space();
    			p13 = element("p");
    			strong1 = element("strong");
    			t31 = text("MISSING PERSON");
    			br3 = element("br");
    			t32 = text("REBECCA DALY");
    			t33 = space();
    			p14 = element("p");
    			p14.textContent = "30 years old, medium build. Last seen on 25 November 2016. Wearing a navy\n      coat with decorative patterns on the hem and brown boots.";
    			t35 = space();
    			p15 = element("p");
    			p15.textContent = "If you have seen this woman or know of her whereabouts, please contact\n      Wicklow Garda Station – 0404 60140";
    			t37 = space();
    			section5 = element("section");
    			p16 = element("p");
    			p16.textContent = "6.";
    			t39 = space();
    			p17 = element("p");
    			p17.textContent = "The Gardaí show you the CCTV footage, hoping you’ll have some insight into\n      Becca’s body language. You sit in the station and lean hungrily towards\n      the screen, watching the final minutes of your sister’s existence.";
    			t41 = space();
    			p18 = element("p");
    			p18.textContent = "The camera is positioned over the Bank of Ireland, down the street from\n      the Mariner. The quality is poor, the picture in black and white. You\n      watch Becca walk out of the pub. Her face is an inscrutable blob of\n      pixels. She’s wearing her good blue coat, the one you described to the\n      Gardaí and showed them on the Zara website. The one they will later call\n      navy in the official missing person release. The coat is a dark shade of\n      grey on the screen, but it remains distinctive due to its decoration: a\n      city silhouette airbrushed on the hem.";
    			t43 = space();
    			p19 = element("p");
    			p19.textContent = "You know that coat, you know those boots. You know that underneath she’s\n      wearing her green dress and black tights. Her go-to going-out outfit when\n      she wasn’t going out out. The Gardaí won’t let you put that on the\n      posters. They’re apologetic, but they can only go on established facts.";
    			t45 = space();
    			p20 = element("p");
    			p20.textContent = "You watch Becca walk down the street. You watch her turn the corner and\n      disappear. The tape continues for another twelve seconds. Twelve seconds\n      of total absence. Then the loop starts again and there is your sister,\n      walking out of the Mariner.";
    			t47 = space();
    			p21 = element("p");
    			p21.textContent = "You want to ask for a copy, but you stop yourself. You know even then that\n      nothing good can come from having it. It would be nothing more than owning\n      the final seconds of a grainy ghost composed in monochrome.";
    			t49 = space();
    			p22 = element("p");
    			t50 = text("‘Thirty can be a tough year for some women,’ the Garda comments, and you\n      think ");
    			em1 = element("em");
    			em1.textContent = "can it?";
    			t52 = space();
    			img0 = element("img");
    			t53 = space();
    			section6 = element("section");
    			p23 = element("p");
    			p23.textContent = "7.";
    			t55 = space();
    			p24 = element("p");
    			t56 = text("There’s no such thing as a Missing Person’s Mass but there’s a Mass said,\n      nonetheless. When the priest says ");
    			em2 = element("em");
    			em2.textContent = "we’ll kneel now";
    			t58 = text(", everyone\n      kneels. When the priest says ");
    			em3 = element("em");
    			em3.textContent = "we’ll bow our heads now";
    			t60 = text(", everyone\n      bows. The priest keeps saying ");
    			em4 = element("em");
    			em4.textContent = "we’ll do this now";
    			t62 = text(" and does none of it\n      himself. The Eucharist is given out and it sits dry and hard on your tongue.\n      This is the anno domini of your life, nothing will be the same after this.");
    			t63 = space();
    			section7 = element("section");
    			p25 = element("p");
    			p25.textContent = "8.";
    			t65 = space();
    			p26 = element("p");
    			p26.textContent = "There’s no reason to believe she went to the sea, but you believe she went\n      to the sea.";
    			t67 = space();
    			section8 = element("section");
    			p27 = element("p");
    			p27.textContent = "9.";
    			t69 = space();
    			p28 = element("p");
    			p28.textContent = "The official search lasts two months. That’s all it takes to write your\n      sister off from reality. Becca was always the neat one, the tidy one.\n      Whatever force made her Gone has respected that core aspect of her\n      personality. There is no body. There are no leads. From the outside it\n      looks as though she has been sliced from reality. Perhaps by a sharp\n      scalpel, the kind she boasted her prowess with when describing her more\n      surgical procedures.";
    			t71 = space();
    			p29 = element("p");
    			p29.textContent = "That’s how it looks, but that’s not the truth of it. The truth is that her\n      disappearance has left a messy, open wound. A torn hole in the\n      quintessential fabric of existence. Ragged edges and pumping blood. Your\n      family must learn to exist around this wound because you know it’s not the\n      kind that will heal. It’s the kind that stays open. Stays raw.";
    			t73 = space();
    			section9 = element("section");
    			p30 = element("p");
    			p30.textContent = "10.";
    			t75 = space();
    			p31 = element("p");
    			p31.textContent = "Saint Anthony looks, Saint Anthony finds, Saint Anthony places in front of\n      my eyes.";
    			t77 = space();
    			section10 = element("section");
    			p32 = element("p");
    			p32.textContent = "11.";
    			t79 = space();
    			p33 = element("p");
    			p33.textContent = "You studied to be an actuary and then realized about fifteen minutes after\n      qualifying that you fucking hated it. You work in a call centre these days\n      while trying to figure out what to do with your life. Your parents used to\n      give you a hard time about it. Not anymore. Not since they learned that\n      there are darker outcomes for daughters than unrealized potential.";
    			t81 = space();
    			p34 = element("p");
    			p34.textContent = "They are so much older now, older than they were. More timid, as though\n      they think that pushing you would disrupt the delicate balance of whatever\n      force protects you from being Gone. They’re more affectionate. They call\n      you ‘pet’. Your lips press into a thin smile at each saccharine sentiment,\n      as though you’re making sure it doesn’t get into your mouth. The rotting\n      honey-juice of their guilt-sodden tenderness.";
    			t83 = space();
    			img1 = element("img");
    			t84 = space();
    			section11 = element("section");
    			p35 = element("p");
    			p35.textContent = "12.";
    			t86 = space();
    			p36 = element("p");
    			t87 = text("Eight months later, on the first night you go out out, your friend’s\n      boyfriend rants about how much he hates his job. You sit with the group\n      and listen, your finger drawing tight little lines on the condensation of\n      your glass. ");
    			em5 = element("em");
    			em5.textContent = "It’s boring,";
    			t89 = text("\n      he says. ");
    			em6 = element("em");
    			em6.textContent = "My boss is a gobshite";
    			t91 = text(", he says.\n      ");
    			em7 = element("em");
    			em7.textContent = "I swear to god, one more week and I’ll off myself";
    			t93 = text(", he says.\n      There’s a brief susurration of laughter before it fades into awkward\n      silence, people’s eyes sliding to you. You smile to cut the tension and\n      continue to stockpile reasons why your sister couldn’t have killed\n      herself.");
    			t94 = space();
    			p37 = element("p");
    			p37.textContent = "You hate that you’re doing it. The existence of the mental list you have\n      curated seems to give weight to the other side of the argument, the idea\n      that there is a debate to be rebutted. But you can’t stop, and though you\n      never write it down, it is always a single thought away, added to as\n      appropriate.";
    			t96 = space();
    			p38 = element("p");
    			p38.textContent = "You begin to dream of the sea. The crashing, roiling sea. Becca is down\n      there somewhere and but for the violence of the waves blocking her\n      attempts to surface, she could come back. You spend entire nights\n      following winding paths down to the seashore, ready to dive in and save\n      her. You never make it. You always wake just as you reach the crest of the\n      sand dunes, the sound of the sea crashing in your ears.";
    			t98 = space();
    			p39 = element("p");
    			p39.textContent = "The dreams don’t stop, so you start avoiding sleep. Instead you lie in the\n      dark and go through your list, running a mental finger down the smudged\n      and tattered page, worn from constant rehashing. You lie there, listening\n      to the sound of your boyfriend breathing. Your boyfriend who has no open\n      wounds in his life and keeps putting his hands over yours, trying to close\n      it with his clumsy fingers. Like he doesn’t know that some things just\n      need to fucking bleed.";
    			t100 = space();
    			section12 = element("section");
    			p40 = element("p");
    			p40.textContent = "13.";
    			t102 = space();
    			p41 = element("p");
    			p41.textContent = "Say someone was in Wicklow Town on a Friday night, and they had a drink at\n      the Mariner. Say they were homesick and lonely and missing Dublin. Say\n      they wanted to leave. Say they wanted to go somewhere alone. Say they\n      wanted to go to the sea.";
    			t104 = space();
    			p42 = element("p");
    			p42.textContent = "First, they’d walk out of the bar, pulling their good blue coat around\n      their shoulders. They’d take a second to look down the dark street,\n      stained with autumnal spatterings of rain. Then they’d turn off to the\n      right, walking alone in the dark. Past the garishly painted Toymaster, and\n      past the Bank of Ireland. They’d turn right again, out of the scope of the\n      bank’s security cameras. They’d turn what’s locally known as the Long\n      Corner, onto a road with farther spaced streetlamps, puddles of darkness\n      gathering at set spaces.";
    			t106 = space();
    			p43 = element("p");
    			p43.textContent = "They’d walk on, past rows of houses predominantly painted in shades of\n      blue. They’d pass the Bridge Tavern, then cross the River Vartry. They’d\n      walk to the bit of town less preoccupied with looking twee for tourists,\n      its houses a more functional spackled brown. They’d walk until they got to\n      the low ones, the bungalows built in deference to sea gales and salty\n      winds.";
    			t108 = space();
    			p44 = element("p");
    			p44.textContent = "A six-minute walk and there they’d be. At the endless, endless sea.";
    			t110 = space();
    			section13 = element("section");
    			p45 = element("p");
    			p45.textContent = "14.";
    			t112 = space();
    			p46 = element("p");
    			p46.textContent = "When calculating the risks posed to a missing person, actuaries used to\n      use the classification method.";
    			t114 = space();
    			p47 = element("p");
    			p47.textContent = "Part One of the risk matrix dealt with personal circumstances. It included\n      factors like age, environment, drug/alcohol dependency and isolation. Part\n      Two examined the circumstances of the disappearance. It included things\n      like ‘out of character behaviour’ or ‘inclement weather conditions’. Each\n      of these was awarded a single score and could then be judged on a scale.";
    			t116 = space();
    			p48 = element("p");
    			p48.textContent = "This method is no longer used. It was too easy to weigh circumstances\n      heavier than they warranted. Too easy to become embroiled into the\n      personal details. Every case became a high-risk case. Every case became\n      important.";
    			t118 = space();
    			p49 = element("p");
    			p49.textContent = "The classification method was deemed inefficient and abandoned.";
    			t120 = space();
    			section14 = element("section");
    			p50 = element("p");
    			p50.textContent = "15.";
    			t122 = space();
    			p51 = element("p");
    			em8 = element("em");
    			em8.textContent = "The Irish Times";
    			br4 = element("br");
    			t124 = text("Tuesday 20 November 2018, 18:28");
    			br5 = element("br");
    			strong2 = element("strong");
    			strong2.textContent = "Gardaí issue Rebecca Daly appeal two years after disappearance";
    			br6 = element("br");
    			em9 = element("em");
    			em9.textContent = "Supt Derek O’Mahoney calls for those with information to come forward";
    			t127 = space();
    			p52 = element("p");
    			p52.textContent = "Gardaí have issued a new appeal for information in relation to missing\n      woman Rebecca Daly as her family prepares to mark the second anniversary\n      of her disappearance.";
    			t129 = space();
    			p53 = element("p");
    			p53.textContent = "Ms Daly (30) vanished from the streets of Wicklow Town in the late hours\n      of 25 November 2016. Her disappearance from a relatively small town so\n      close to Christmas was the subject of a high-profile search and publicity\n      campaign, but no trace was ever found. A Bank of Ireland CCTV camera on\n      Main Street, Wicklow recorded her passing by at 11.20pm heading towards\n      Bridge Street.";
    			t131 = space();
    			p54 = element("p");
    			p54.textContent = "Supt Derek O’Mahoney is appealing for anybody with information to contact\n      the Garda Confidential line 1800 666 111 or any Garda Station.";
    			t133 = space();
    			p55 = element("p");
    			p55.textContent = "Ms Daly is described as 5ft 6ins, of medium build with blonde\n      shoulder-length hair and brown eyes.";
    			t135 = space();
    			img2 = element("img");
    			t136 = space();
    			section15 = element("section");
    			p56 = element("p");
    			p56.textContent = "16.";
    			t138 = space();
    			p57 = element("p");
    			t139 = text("Your boyfriend doesn’t leave, because imagine leaving. Leaving his\n      girlfriend with the missing sister. His girlfriend who has grown distant\n      and cold and still, like a lake frozen over in winter. That’s the only\n      reason he doesn’t leave and you know it. When it hits the two year mark\n      you push him out instead, and still manage to make him feel like it’s his\n      fault.");
    			em10 = element("em");
    			em10.textContent = "Grand";
    			t141 = text(", you say.\n      ");
    			em11 = element("em");
    			em11.textContent = "Fine. Fuck off with yourself.";
    			t143 = text(" Your social circle is neatly halved.\n      You feel better for it.");
    			t144 = space();
    			section16 = element("section");
    			p58 = element("p");
    			p58.textContent = "17.";
    			t146 = space();
    			p59 = element("p");
    			p59.textContent = "Niamh rings you one evening, while you’re examining your new conditioner.\n      You’re trying to go all natural, and you can’t remember whether parabens\n      are allowed. You answer the phone without thinking, and it’s only after\n      the pleasantries that you remember Niamh never calls.";
    			t148 = space();
    			p60 = element("p");
    			p60.textContent = "‘I have to do a Form 12 for Revenue,’ she says. ‘They sent me a letter.’\n      There’s something about the way she says it that makes you hesitate, and\n      that beat of silence is enough to damage whatever was hanging in the\n      balance. ‘Yeah, it’s fine, never mind. I’ll ask Dad.’ Her voice sounds\n      thick, her throat sounds raw, and before you can say anything else, she\n      hangs up.";
    			t150 = space();
    			p61 = element("p");
    			p61.textContent = "You feel bad for a minute, but then the feeling fades. It is unfortunate\n      that Niamh has lost the sister who took care of her, but in fairness, so\n      have you.";
    			t152 = space();
    			section17 = element("section");
    			p62 = element("p");
    			p62.textContent = "18.";
    			t154 = space();
    			p63 = element("p");
    			p63.textContent = "In most fatal accident cases that make it to the High Court, an actuary is\n      brought in as an expert witness, to tally up the total loss to the\n      survivors. The losses incurred by the financial dependents of the deceased\n      are quantified under the following headings:";
    			t156 = space();
    			ul = element("ul");
    			li0 = element("li");
    			li0.textContent = "Loss of financial dependency since the accident;";
    			t158 = space();
    			li1 = element("li");
    			li1.textContent = "Loss of future financial dependency prior to retirement;";
    			t160 = space();
    			li2 = element("li");
    			li2.textContent = "Loss of future financial dependency after retirement;";
    			t162 = space();
    			li3 = element("li");
    			li3.textContent = "Loss of services provided by the deceased;";
    			t164 = space();
    			li4 = element("li");
    			li4.textContent = "Accelerated value of deductible assets passing on death.";
    			t166 = space();
    			p64 = element("p");
    			p64.textContent = "The actuary sits down with a calculator. They tot up the total financial\n      loss accumulated as a result of a person being taken before their time.\n      ‘Before their time,’ as though it’s possible to know when that time is.";
    			t168 = space();
    			p65 = element("p");
    			p65.textContent = "Maybe there’s another kind of actuary. A tall figure draped in seaweed and\n      stinking of fish. A dark shadow who rises from the depths to skulk the\n      streets at night. Who watches us and records the tally marks that the\n      years carve into our bones. An actuary who, through some strange\n      arithmetic, decides when it is time.";
    			t170 = space();
    			section18 = element("section");
    			p66 = element("p");
    			p66.textContent = "19.";
    			t172 = space();
    			p67 = element("p");
    			p67.textContent = "Becca had thick hair, chopped at an elegant length that circled her neck.\n      When she was working, she tied it back in a neat ponytail. It was\n      efficient hair, knowledgeable hair.";
    			t174 = space();
    			p68 = element("p");
    			p68.textContent = "Your hair is wild and thin and prone to over-enthusiastic impressionist\n      shapes. No matter how tight you tie it back there are always escaping\n      strands, tiny tendrils coiling and cajoling you back to dreamland. One\n      day, as you sit at your computer, fighting the flailing strands into a\n      bejewelled hairclip, a question occurs to you.";
    			t176 = space();
    			p69 = element("p");
    			p69.textContent = "Are you the eldest sister now? Is that how it works?";
    			t178 = space();
    			p70 = element("p");
    			p70.textContent = "You wonder about your parents. You wonder if your parents pause when they\n      meet new people, if they are asked about their children. You wonder if\n      they say they have three daughters or two.";
    			t180 = space();
    			p71 = element("p");
    			p71.textContent = "You get sick in the toilet at work. You swallow two Panadol, willow-bark\n      bitterness coating your tongue. Someone suggests you go home early. You\n      refuse. After all, it’s over two years since your sister disappeared.";
    			t182 = space();
    			p72 = element("p");
    			p72.textContent = "You throw out the hairclip. Garish, shiny tat.";
    			t184 = space();
    			section19 = element("section");
    			p73 = element("p");
    			p73.textContent = "20.";
    			t186 = space();
    			p74 = element("p");
    			strong3 = element("strong");
    			strong3.textContent = "A Mental List of Reasons Why Your Sister Couldn’t Have Killed Herself";
    			t188 = space();
    			ol = element("ol");
    			li5 = element("li");
    			li5.textContent = "She was thinking about getting a cat.";
    			t190 = space();
    			li6 = element("li");
    			li6.textContent = "She just bought, like, three succulents.";
    			t192 = space();
    			li7 = element("li");
    			li7.textContent = "One week before she died, she bought the Sunday Riley Good Genes Lactic\n        Acid Treatment on the internet for £85.00, not including shipping and\n        when the pound to euro exchange rate was bad, so there’s no way that\n        would have been let go to waste.";
    			t194 = space();
    			li8 = element("li");
    			li8.textContent = "She was talking about taking up guitar.";
    			t196 = space();
    			li9 = element("li");
    			li9.textContent = "It was too close to Christmas, she loved Christmas.";
    			t198 = space();
    			li10 = element("li");
    			li10.textContent = "When you went to her apartment, after it was clear that this was\n        serious, it was clear that she was Gone, and you were enveloped in the\n        scent of her, surrounded by her things, you started picking through her\n        drawers looking for clues, and you opened her fridge and you looked\n        inside and there was half a cheesecake, and if you were going to kill\n        yourself you would have eaten the whole cheesecake and you and your\n        sister are quite alike in impulses and general temperament, or so you\n        are told.";
    			t200 = space();
    			li11 = element("li");
    			li11.textContent = "She wouldn’t do that.";
    			t202 = space();
    			li12 = element("li");
    			li12.textContent = "She just wouldn’t do that.";
    			t204 = space();
    			li13 = element("li");
    			li13.textContent = "She wouldn’t do that to you.";
    			t206 = space();
    			img3 = element("img");
    			t207 = space();
    			section20 = element("section");
    			p75 = element("p");
    			p75.textContent = "21.";
    			t209 = space();
    			p76 = element("p");
    			p76.textContent = "One day, nearly three years later, you’re in the Penneys on Mary Street\n      and you’re not thinking about Becca at all.";
    			t211 = space();
    			p77 = element("p");
    			p77.textContent = "You meet an old neighbour of your parents’, a woman whose sun-exposed skin\n      reminds you of the last time your father cooked duck – all puckered, oily,\n      uneven brown. She’s been living in Spain the last seven years, she says.\n      Moved there when she retired, just back to visit family. She asks you how\n      your Mammy is. She asks you how Niamh is getting on. She asks you how\n      Becca is doing.";
    			t213 = space();
    			p78 = element("p");
    			t214 = text("The moment when a drowning person takes an involuntary breath under water\n      is known as the ‘break point’. For a moment you think that this is it.\n      This is the point at which you break. Her mouth is still moving, but all\n      you can hear is muffled ringing, all you can feel is the rush of cold\n      water against your skin as you drown. You want to slap her for reminding\n      you and you want to slap her for being here and you want to slap her for\n      not knowing. How can she not ");
    			em12 = element("em");
    			em12.textContent = "know?";
    			t216 = text(" But then you remember that life\n      goes on. That the gaping ragged hole only exists in your world.");
    			t217 = space();
    			p79 = element("p");
    			p79.textContent = "Even though it feels hateful to her memory, you don’t want to talk about\n      your missing sister here, while you’re holding a jumpsuit reduced to €5\n      that’s a size too small but could be aspirational. You don’t feel like you\n      owe this woman enough to do that to yourself, and so you dodge the\n      question, change the subject. You move on.";
    			t219 = space();
    			section21 = element("section");
    			p80 = element("p");
    			p80.textContent = "22.";
    			t221 = space();
    			p81 = element("p");
    			p81.textContent = "The Life Table is a table created by actuarial science which shows, for\n      each age, what the probability is that a person of that age will die\n      before their next birthday.";
    			t223 = space();
    			section22 = element("section");
    			p82 = element("p");
    			p82.textContent = "23.";
    			t225 = space();
    			p83 = element("p");
    			p83.textContent = "Listen. Here is your secret: You still call Becca.";
    			t227 = space();
    			p84 = element("p");
    			p84.textContent = "You call Becca all the fucking time.";
    			t229 = space();
    			p85 = element("p");
    			t230 = text("Her phone rang, the first couple of days during the search. Then it\n      stopped ringing and started going straight to voicemail. It’s been three\n      years and you can still remember the exact moment, the electric shock that\n      raced down your spine, the crashing wave of relief when you heard her\n      voice, thinking ");
    			em13 = element("em");
    			em13.textContent = "she’s okay, she’s okay";
    			t232 = text(" before you realized.");
    			t233 = space();
    			p86 = element("p");
    			t234 = text("You still ring her, listening to the careless trip of her words as she\n      tells you that ");
    			em14 = element("em");
    			em14.textContent = "You’ve reached Becca Daly. I can’t get to the phone right now but leave\n        a message and I’ll get back to you as soon as I can!";
    			t236 = space();
    			p87 = element("p");
    			p87.textContent = "It’s like a promise, so you do. You ring her, you listen to her voice, and\n      you leave her a message.";
    			t238 = space();
    			p88 = element("p");
    			p88.textContent = "She’ll get back to you as soon as she can.";
    			t240 = space();
    			section23 = element("section");
    			p89 = element("p");
    			p89.textContent = "24.";
    			t242 = space();
    			p90 = element("p");
    			p90.textContent = "The year you turn thirty is not a good year.";
    			t244 = space();
    			p91 = element("p");
    			p91.textContent = "Will this be the year that you go missing? Snatched from the footpath, in\n      the shadow between two streetlights. Leaving no trace, leaving the world\n      to go on without you after the appropriate two months of searching and\n      handwringing.";
    			t246 = space();
    			p92 = element("p");
    			p92.textContent = "That’s nonsense. You won’t let it colour your decision making.";
    			t248 = space();
    			p93 = element("p");
    			p93.textContent = "It does anyway.";
    			t250 = space();
    			p94 = element("p");
    			p94.textContent = "You cancel plans, curb the extent of your social presence, fail to renew\n      subscriptions. You’re due new glasses, and you put off the optometrist\n      appointment because you won’t need them when you’re Gone.";
    			t252 = space();
    			p95 = element("p");
    			p95.textContent = "You drink more. You’re alone more. The strange tumour of a thought\n      pertaining to your birthday, the idea that it will fatefully and\n      unavoidably be your last, comes with a righteous indignation that tastes\n      like tin. It comes with the idea that you are safe until then. No dark\n      shadow would dare snatch you up. Not yet. Not before your time.";
    			t254 = space();
    			section24 = element("section");
    			p96 = element("p");
    			p96.textContent = "25.";
    			t256 = space();
    			p97 = element("p");
    			p97.textContent = "‘Finally the Immaculate Virgin, preserved free from all stain of original\n      sin, when the course of her earthly life was finished, was taken up body\n      and soul into heavenly glory, and exalted by the Lord as Queen over all\n      things, so that she might be the more fully conformed to her Son, the Lord\n      of lords and conqueror of sin and death.’";
    			t258 = space();
    			p98 = element("p");
    			p98.textContent = "— The Bodily Assumption of Mary, Catechism of the Catholic Church, 966";
    			t260 = space();
    			img4 = element("img");
    			t261 = space();
    			section25 = element("section");
    			p99 = element("p");
    			p99.textContent = "26.";
    			t263 = space();
    			p100 = element("p");
    			t264 = space();
    			p101 = element("p");
    			p101.textContent = "You agree to have your birthday party in Annascaul, your father’s\n      childhood town. Your parents are looking for a distraction; they want to\n      make it about family. You’re relieved to give the few friends you have\n      left an excuse not to attend.";
    			t266 = space();
    			p102 = element("p");
    			t267 = text("The festivities are held in Patcheen’s Pub, its stone walls bedecked with\n      balloons. Streamers hang between black and white photos, over the glass\n      case housing a taxidermy hare. There’s a buffet of cocktail sausages and\n      eggy sandwiches. Aunts and uncles and second cousins all drink and laugh\n      and dance furiously to the over-enthusiastic DJ who keeps asking ");
    			em15 = element("em");
    			em15.textContent = "Are we all having a good tyyyyyme?";
    			t269 = space();
    			p103 = element("p");
    			p103.textContent = "You’re there to smile and chat and slip away unnoticed around midnight.\n      You’re not there to fight with Niamh, but that’s what ends up happening.\n      You watch her mouth as she screams at you, tequila salt still clinging to\n      her lips. She’s very drunk. You can’t remember what the instigating\n      incident was, the only thing you remember is that she spat the words\n      ‘She’s dead, not you’ so you slapped her.";
    			t271 = space();
    			p104 = element("p");
    			p104.textContent = "Hard.";
    			t273 = space();
    			p105 = element("p");
    			p105.textContent = "You push past the inward rush of relatives and manage to slam your way\n      into the ladies. You pull a stall door closed and lock it, shaking hands\n      pulling your mobile from your purse. Hardly thinking, moving by muscle\n      memory, your thumb flicks open Contacts and taps Becca’s name. You make\n      sure it’s ringing, and then lift the phone to your ear.";
    			t275 = space();
    			p106 = element("p");
    			p106.textContent = "‘Hello?’";
    			t277 = space();
    			p107 = element("p");
    			p107.textContent = "Your heart might shatter your ribs. ‘Becca?’";
    			t279 = space();
    			p108 = element("p");
    			p108.textContent = "‘No, sorry.’ A man’s voice. ‘Wrong number.’";
    			t281 = space();
    			p109 = element("p");
    			p109.textContent = "The number is the same. It’s been given away.";
    			t283 = space();
    			p110 = element("p");
    			p110.textContent = "You want your phone to shatter into a thousand pieces. When you fuck it to\n      the floor, you want it obliterated. Instead it hits the tile with a sound\n      like snapping plastic. It lands face up and you see that the screen is now\n      a mass of ugly jagged pieces. You know that’s what you are. Splintered\n      pieces of glass trying to stay together.";
    			t285 = space();
    			p111 = element("p");
    			p111.textContent = "When you return to the party, they tell you that Niamh left. They tell you\n      they can’t find her.";
    			t287 = space();
    			p112 = element("p");
    			p112.textContent = "They tell you that your sister is Gone.";
    			t289 = space();
    			section26 = element("section");
    			p113 = element("p");
    			p113.textContent = "27.";
    			t291 = space();
    			p114 = element("p");
    			t292 = text("‘Oh my fuck. Are these all ");
    			em16 = element("em");
    			em16.textContent = "Niamh’s";
    			t294 = text("? Is this her MED1 paperwork?\n      Becca!’ You’re going through the piles of papers on Becca’s desk in her\n      living room. She’s moving out of Dublin in three weeks, and her apartment\n      is messier than you’ve ever seen it. Higgledy piggledy, boxes and clothes\n      on every surface. ’Jesus Christ. You always do her forms for her, would\n      you not just leave her at it?’");
    			t295 = space();
    			p115 = element("p");
    			p115.textContent = "‘Ah but she gets fierce stressed.’ Becca is in her room getting changed.\n      Her voice carries over the low thump of music from the Bluetooth speakers\n      on the couch.";
    			t297 = space();
    			p116 = element("p");
    			p116.textContent = "‘She’ll keep getting stressed if she’s allowed avoid them,’ you snort,\n      tossing the forms back on the table. ‘It’s just paperwork, for fuck’s\n      sake.’";
    			t299 = space();
    			p117 = element("p");
    			t300 = text("‘Come here, how do I look?’ Becca comes out. She’s going ");
    			em17 = element("em");
    			em17.textContent = "out";
    			t302 = text(" out,\n      all red dress and dangly earrings.");
    			t303 = space();
    			p118 = element("p");
    			p118.textContent = "‘Fuck me, does he know he’s getting the ride?’";
    			t305 = space();
    			p119 = element("p");
    			p119.textContent = "‘It’s my goodbye tour of Dublin, I’d say he knows all right.’";
    			t307 = space();
    			p120 = element("p");
    			p120.textContent = "You shriek with laughter and throw a pillow at her. ‘A goodbye tour means\n      visiting the fucking landmarks, not doing a round on every fella you’ve\n      shifted in Coppers!’";
    			t309 = space();
    			p121 = element("p");
    			p121.textContent = "Becca takes a drink of red wine from her glass and is left with two curled\n      lines coming up from her bottom lip, giving her grin a devilish cast. A\n      month ago, she went blonde. Objectively, it suits her, but you still\n      prefer her dark. ‘Sure, I’m thirty now. I have to engage in a bit of\n      debauchery before moving to the backarse of nowhere. Drowning in the\n      boredom of adulthood.’";
    			t311 = space();
    			p122 = element("p");
    			p122.textContent = "‘Lovely.’ You rub the sides of your mouth with your forefinger and thumb,\n      flagging the wine marks.";
    			t313 = space();
    			p123 = element("p");
    			p123.textContent = "She takes the hint and wipes, peering in the mirror to ensure her face is\n      unmarred. Then she pulls her phone from her bag. ‘Fuck. My taxi is here.\n      Can you lock up on your way out?’";
    			t315 = space();
    			p124 = element("p");
    			p124.textContent = "‘Yeah, no bother. Enjoy yourself!’";
    			t317 = space();
    			p125 = element("p");
    			p125.textContent = "‘Say a prayer to St. Jude!’ She’s halfway out the door, coat pulled on,\n      dangly earrings brushing her fragrant, powdered cheeks.";
    			t319 = space();
    			p126 = element("p");
    			p126.textContent = "‘Patron saint of lost causes!’ you both chorus, and you’re laughing as she\n      closes the door behind her.";
    			t321 = space();
    			section27 = element("section");
    			p127 = element("p");
    			p127.textContent = "28.";
    			t323 = space();
    			p128 = element("p");
    			p128.textContent = "You can taste bile and saltwater in your mouth as your car bumps and dips\n      along the narrow rural roads. You shouldn’t be driving; you’ve had three\n      glasses of wine. Maybe more, by the way it’s creeping up the back of your\n      throat.";
    			t325 = space();
    			p129 = element("p");
    			p129.textContent = "You’ve developed the habit of counting seconds in sets of twelve when the\n      world gets overwhelming. Over and over. You’re counting now, as you drive\n      a little too fast and take turns a little too hard.";
    			t327 = space();
    			p130 = element("p");
    			p130.textContent = "You have no idea where Niamh has gone but you drive to the sea, feeling\n      like you’re dreaming, feeling like this is the end of all the dreams. This\n      is where it ends, and you will either be Gone by morning (before your\n      time) or nothing will happen at all. No other options. Because it was\n      meant to be you. It was meant to be you, and you will not do this again.\n      You will not lose the other half of your heart.";
    			t329 = space();
    			section28 = element("section");
    			p131 = element("p");
    			p131.textContent = "29.";
    			t331 = space();
    			p132 = element("p");
    			p132.textContent = "Saint Anthony looks, Saint Anthony finds, Saint Anthony places in front of\n      my eyes.";
    			t333 = space();
    			img5 = element("img");
    			t334 = space();
    			section29 = element("section");
    			p133 = element("p");
    			p133.textContent = "30.";
    			t336 = space();
    			p134 = element("p");
    			p134.textContent = "The car that your sister shouldn’t have driven is parked at an angle on\n      Inch Beach. The door is open, the headlights are on. Niamh isn’t inside,\n      but you spot her silhouette in the distance, illuminated by the beams. She\n      may be the youngest, but she’s also the tallest. When she was a teenager\n      learning to walk in heels, you watched her long coltish legs wobble as\n      they picked out safe paths.";
    			t338 = space();
    			p135 = element("p");
    			p135.textContent = "She’s going to the sea.";
    			t340 = space();
    			p136 = element("p");
    			p136.textContent = "Niamh doesn’t hear your engine over the sound of the waves, doesn’t turn\n      as you stumble from the car. You are far, far behind her, so you have to\n      run and run and run as she walks, slow and with purpose. The sound of the\n      crashing water is loud enough that she doesn’t hear your bare feet\n      thudding on the sand until the last second – you don’t remember taking off\n      your heels – half-turning to you as your bodies collide and her hair is in\n      your mouth and the filmy material of her dress (an out out outfit) is\n      gripped in your fist as you knock her to the ground, you hold her down,\n      and you keep her Here.";
    			t342 = space();
    			p137 = element("p");
    			p137.textContent = "‘Let me go!’ she screams, thrashing beneath you, voice ragged and wet and\n      broken. There’s sand on her lips. The words come from her throat in a\n      drawn out, jagged wail. A child’s cry of pure misery. ‘Let me go!’";
    			t344 = space();
    			p138 = element("p");
    			p138.textContent = "You don’t let her go.";
    			t346 = space();
    			p139 = element("p");
    			p139.textContent = "The sound of the waves is a smooth, repeating rumble. Nothing like the\n      sharp fractured crashes of your dreams.";
    			t348 = space();
    			p140 = element("p");
    			p140.textContent = "You hold your sister. You are thirty years old.";
    			t350 = space();
    			p141 = element("p");
    			br7 = element("br");
    			t351 = space();
    			p142 = element("p");
    			p142.textContent = "⁙";
    			t353 = space();
    			div1 = element("div");
    			p143 = element("p");
    			em18 = element("em");
    			em18.textContent = "Saint Sisters & The Sea";
    			t355 = text(", written by Méabh de Brún, was first\n    published in\n    ");
    			em19 = element("em");
    			a0 = element("a");
    			a0.textContent = "Banshee";
    			t357 = text(".");
    			t358 = space();
    			p144 = element("p");
    			t359 = text("Méabh de Brún is an award-winning actor, playwright and writer. Her short\n    fiction has been published in ");
    			em20 = element("em");
    			em20.textContent = "The Stinging Fly";
    			t361 = text(",\n    ");
    			em21 = element("em");
    			em21.textContent = "Banshee Lit";
    			t363 = text(", ");
    			em22 = element("em");
    			em22.textContent = "Mysterion Magazine";
    			t365 = text(", ");
    			em23 = element("em");
    			em23.textContent = "Giganotosaurus";
    			t367 = text("\n    and more. She is a finalist for RTÉ's Francis MacManus Short Story Award and\n    received the DCLI/ACDI Playwriting Award for her play\n    ");
    			em24 = element("em");
    			em24.textContent = "Dead Man's Bells";
    			t369 = text(", which picked up eight awards nationally,\n    including her festival award for Best Actor.");
    			t370 = space();
    			p145 = element("p");
    			p145.textContent = "A recipient of the Tyrone Guthrie bursary and the Valentino Scholarship for\n    Emerging Writers, she currently lives in Kerry, where she is working on her\n    first novel and on anything else that comes to mind.";
    			t372 = space();
    			p146 = element("p");
    			a1 = element("a");
    			a1.textContent = "meabhdebrun.org";
    			attr_dev(p0, "class", "num svelte-18y9jk5");
    			add_location(p0, file$c, 40, 4, 1076);
    			add_location(p1, file$c, 41, 4, 1102);
    			add_location(p2, file$c, 49, 4, 1539);
    			add_location(p3, file$c, 55, 4, 1826);
    			attr_dev(section0, "class", "svelte-18y9jk5");
    			add_location(section0, file$c, 39, 2, 1062);
    			attr_dev(p4, "class", "num svelte-18y9jk5");
    			add_location(p4, file$c, 61, 4, 2007);
    			add_location(p5, file$c, 62, 4, 2033);
    			attr_dev(section1, "class", "svelte-18y9jk5");
    			add_location(section1, file$c, 60, 2, 1993);
    			attr_dev(p6, "class", "num svelte-18y9jk5");
    			add_location(p6, file$c, 70, 4, 2343);
    			add_location(strong0, file$c, 72, 6, 2379);
    			add_location(br0, file$c, 72, 30, 2403);
    			add_location(br1, file$c, 72, 50, 2423);
    			add_location(em0, file$c, 72, 56, 2429);
    			add_location(br2, file$c, 72, 69, 2442);
    			add_location(p7, file$c, 71, 4, 2369);
    			attr_dev(section2, "class", "svelte-18y9jk5");
    			add_location(section2, file$c, 69, 2, 2329);
    			attr_dev(p8, "class", "num svelte-18y9jk5");
    			add_location(p8, file$c, 78, 4, 2659);
    			add_location(p9, file$c, 79, 4, 2685);
    			add_location(p10, file$c, 85, 4, 2965);
    			add_location(p11, file$c, 92, 4, 3358);
    			attr_dev(section3, "class", "svelte-18y9jk5");
    			add_location(section3, file$c, 77, 2, 2645);
    			attr_dev(p12, "class", "num svelte-18y9jk5");
    			add_location(p12, file$c, 99, 4, 3648);
    			add_location(br3, file$c, 100, 29, 3699);
    			add_location(strong1, file$c, 100, 7, 3677);
    			add_location(p13, file$c, 100, 4, 3674);
    			add_location(p14, file$c, 101, 4, 3735);
    			add_location(p15, file$c, 105, 4, 3896);
    			attr_dev(section4, "class", "tc svelte-18y9jk5");
    			add_location(section4, file$c, 98, 2, 3623);
    			attr_dev(p16, "class", "num svelte-18y9jk5");
    			add_location(p16, file$c, 111, 4, 4056);
    			add_location(p17, file$c, 112, 4, 4082);
    			add_location(p18, file$c, 117, 4, 4331);
    			add_location(p19, file$c, 127, 4, 4934);
    			add_location(p20, file$c, 133, 4, 5261);
    			add_location(p21, file$c, 139, 4, 5546);
    			add_location(em1, file$c, 146, 12, 5886);
    			add_location(p22, file$c, 144, 4, 5791);
    			attr_dev(section5, "class", "svelte-18y9jk5");
    			add_location(section5, file$c, 110, 2, 4042);
    			attr_dev(img0, "class", "cctv svelte-18y9jk5");
    			if (img0.src !== (img0_src_value = "/assets/images/ss1.jpg")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "cctv");
    			add_location(img0, file$c, 149, 2, 5927);
    			attr_dev(p23, "class", "num svelte-18y9jk5");
    			add_location(p23, file$c, 151, 4, 6004);
    			add_location(em2, file$c, 154, 40, 6154);
    			add_location(em3, file$c, 155, 35, 6224);
    			add_location(em4, file$c, 156, 36, 6303);
    			add_location(p24, file$c, 152, 4, 6030);
    			attr_dev(section6, "class", "svelte-18y9jk5");
    			add_location(section6, file$c, 150, 2, 5990);
    			attr_dev(p25, "class", "num svelte-18y9jk5");
    			add_location(p25, file$c, 162, 4, 6552);
    			add_location(p26, file$c, 163, 4, 6578);
    			attr_dev(section7, "class", "svelte-18y9jk5");
    			add_location(section7, file$c, 161, 2, 6538);
    			attr_dev(p27, "class", "num svelte-18y9jk5");
    			add_location(p27, file$c, 169, 4, 6719);
    			add_location(p28, file$c, 170, 4, 6745);
    			add_location(p29, file$c, 179, 4, 7246);
    			attr_dev(section8, "class", "svelte-18y9jk5");
    			add_location(section8, file$c, 168, 2, 6705);
    			attr_dev(p30, "class", "num svelte-18y9jk5");
    			add_location(p30, file$c, 188, 4, 7667);
    			add_location(p31, file$c, 189, 4, 7694);
    			attr_dev(section9, "class", "svelte-18y9jk5");
    			add_location(section9, file$c, 187, 2, 7653);
    			attr_dev(p32, "class", "num svelte-18y9jk5");
    			add_location(p32, file$c, 195, 4, 7832);
    			add_location(p33, file$c, 196, 4, 7859);
    			add_location(p34, file$c, 203, 4, 8270);
    			attr_dev(section10, "class", "svelte-18y9jk5");
    			add_location(section10, file$c, 194, 2, 7818);
    			attr_dev(img1, "class", "cctv svelte-18y9jk5");
    			if (img1.src !== (img1_src_value = "/assets/images/ss2.jpg")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "cctv");
    			add_location(img1, file$c, 212, 2, 8748);
    			attr_dev(p35, "class", "num svelte-18y9jk5");
    			add_location(p35, file$c, 214, 4, 8825);
    			add_location(em5, file$c, 219, 18, 9107);
    			add_location(em6, file$c, 220, 15, 9144);
    			add_location(em7, file$c, 221, 6, 9191);
    			add_location(p36, file$c, 215, 4, 8852);
    			add_location(p37, file$c, 227, 4, 9514);
    			add_location(p38, file$c, 234, 4, 9863);
    			add_location(p39, file$c, 242, 4, 10324);
    			attr_dev(section11, "class", "svelte-18y9jk5");
    			add_location(section11, file$c, 213, 2, 8811);
    			attr_dev(p40, "class", "num svelte-18y9jk5");
    			add_location(p40, file$c, 253, 4, 10871);
    			add_location(p41, file$c, 254, 4, 10898);
    			add_location(p42, file$c, 260, 4, 11180);
    			add_location(p43, file$c, 270, 4, 11773);
    			add_location(p44, file$c, 278, 4, 12195);
    			attr_dev(section12, "class", "svelte-18y9jk5");
    			add_location(section12, file$c, 252, 2, 10857);
    			attr_dev(p45, "class", "num svelte-18y9jk5");
    			add_location(p45, file$c, 281, 4, 12299);
    			add_location(p46, file$c, 282, 4, 12326);
    			add_location(p47, file$c, 286, 4, 12458);
    			add_location(p48, file$c, 293, 4, 12874);
    			add_location(p49, file$c, 299, 4, 13135);
    			attr_dev(section13, "class", "svelte-18y9jk5");
    			add_location(section13, file$c, 280, 2, 12285);
    			attr_dev(p50, "class", "num svelte-18y9jk5");
    			add_location(p50, file$c, 302, 4, 13235);
    			add_location(em8, file$c, 304, 6, 13272);
    			add_location(br4, file$c, 304, 30, 13296);
    			add_location(br5, file$c, 304, 67, 13333);
    			add_location(strong2, file$c, 304, 73, 13339);
    			add_location(br6, file$c, 306, 7, 13434);
    			add_location(em9, file$c, 306, 13, 13440);
    			add_location(p51, file$c, 303, 4, 13262);
    			add_location(p52, file$c, 310, 4, 13548);
    			add_location(p53, file$c, 315, 4, 13749);
    			add_location(p54, file$c, 323, 4, 14179);
    			add_location(p55, file$c, 327, 4, 14345);
    			attr_dev(section14, "class", "svelte-18y9jk5");
    			add_location(section14, file$c, 301, 2, 13221);
    			attr_dev(img2, "class", "cctv svelte-18y9jk5");
    			if (img2.src !== (img2_src_value = "/assets/images/ss3.jpg")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "alt", "cctv");
    			add_location(img2, file$c, 332, 2, 14484);
    			attr_dev(p56, "class", "num svelte-18y9jk5");
    			add_location(p56, file$c, 334, 4, 14561);
    			add_location(em10, file$c, 341, 12, 14991);
    			add_location(em11, file$c, 342, 6, 15022);
    			add_location(p57, file$c, 335, 4, 14588);
    			attr_dev(section15, "class", "svelte-18y9jk5");
    			add_location(section15, file$c, 333, 2, 14547);
    			attr_dev(p58, "class", "num svelte-18y9jk5");
    			add_location(p58, file$c, 347, 4, 15166);
    			add_location(p59, file$c, 348, 4, 15193);
    			add_location(p60, file$c, 354, 4, 15507);
    			add_location(p61, file$c, 362, 4, 15928);
    			attr_dev(section16, "class", "svelte-18y9jk5");
    			add_location(section16, file$c, 346, 2, 15152);
    			attr_dev(p62, "class", "num svelte-18y9jk5");
    			add_location(p62, file$c, 369, 4, 16144);
    			add_location(p63, file$c, 370, 4, 16171);
    			add_location(li0, file$c, 377, 6, 16485);
    			add_location(li1, file$c, 378, 6, 16549);
    			add_location(li2, file$c, 379, 6, 16621);
    			add_location(li3, file$c, 380, 6, 16690);
    			add_location(li4, file$c, 381, 6, 16748);
    			add_location(ul, file$c, 376, 4, 16474);
    			add_location(p64, file$c, 383, 4, 16828);
    			add_location(p65, file$c, 388, 4, 17080);
    			attr_dev(section17, "class", "svelte-18y9jk5");
    			add_location(section17, file$c, 368, 2, 16130);
    			attr_dev(p66, "class", "num svelte-18y9jk5");
    			add_location(p66, file$c, 397, 4, 17470);
    			add_location(p67, file$c, 398, 4, 17497);
    			add_location(p68, file$c, 403, 4, 17708);
    			add_location(p69, file$c, 410, 4, 18086);
    			add_location(p70, file$c, 411, 4, 18150);
    			add_location(p71, file$c, 416, 4, 18373);
    			add_location(p72, file$c, 421, 4, 18623);
    			attr_dev(section18, "class", "svelte-18y9jk5");
    			add_location(section18, file$c, 396, 2, 17456);
    			attr_dev(p73, "class", "num svelte-18y9jk5");
    			add_location(p73, file$c, 424, 4, 18706);
    			add_location(strong3, file$c, 426, 6, 18743);
    			add_location(p74, file$c, 425, 4, 18733);
    			add_location(li5, file$c, 431, 6, 18870);
    			add_location(li6, file$c, 432, 6, 18923);
    			add_location(li7, file$c, 433, 6, 18979);
    			add_location(li8, file$c, 439, 6, 19278);
    			add_location(li9, file$c, 440, 6, 19333);
    			add_location(li10, file$c, 441, 6, 19400);
    			add_location(li11, file$c, 451, 6, 19981);
    			add_location(li12, file$c, 452, 6, 20018);
    			add_location(li13, file$c, 453, 6, 20060);
    			attr_dev(ol, "class", "svelte-18y9jk5");
    			add_location(ol, file$c, 430, 4, 18859);
    			attr_dev(section19, "class", "svelte-18y9jk5");
    			add_location(section19, file$c, 423, 2, 18692);
    			attr_dev(img3, "class", "cctv svelte-18y9jk5");
    			if (img3.src !== (img3_src_value = "/assets/images/ss4.jpg")) attr_dev(img3, "src", img3_src_value);
    			attr_dev(img3, "alt", "cctv");
    			add_location(img3, file$c, 456, 2, 20123);
    			attr_dev(p75, "class", "num svelte-18y9jk5");
    			add_location(p75, file$c, 458, 4, 20200);
    			add_location(p76, file$c, 459, 4, 20227);
    			add_location(p77, file$c, 463, 4, 20372);
    			add_location(em12, file$c, 478, 35, 21317);
    			add_location(p78, file$c, 471, 4, 20808);
    			add_location(p79, file$c, 481, 4, 21447);
    			attr_dev(section20, "class", "svelte-18y9jk5");
    			add_location(section20, file$c, 457, 2, 20186);
    			attr_dev(p80, "class", "num svelte-18y9jk5");
    			add_location(p80, file$c, 490, 4, 21849);
    			add_location(p81, file$c, 491, 4, 21876);
    			attr_dev(section21, "class", "svelte-18y9jk5");
    			add_location(section21, file$c, 489, 2, 21835);
    			attr_dev(p82, "class", "num svelte-18y9jk5");
    			add_location(p82, file$c, 498, 4, 22105);
    			add_location(p83, file$c, 499, 4, 22132);
    			add_location(p84, file$c, 500, 4, 22194);
    			add_location(em13, file$c, 506, 22, 22578);
    			add_location(p85, file$c, 501, 4, 22242);
    			add_location(em14, file$c, 510, 21, 22746);
    			add_location(p86, file$c, 508, 4, 22644);
    			add_location(p87, file$c, 515, 4, 22917);
    			add_location(p88, file$c, 519, 4, 23046);
    			attr_dev(section22, "class", "svelte-18y9jk5");
    			add_location(section22, file$c, 497, 2, 22091);
    			attr_dev(p89, "class", "num svelte-18y9jk5");
    			add_location(p89, file$c, 522, 4, 23125);
    			add_location(p90, file$c, 523, 4, 23152);
    			add_location(p91, file$c, 524, 4, 23208);
    			add_location(p92, file$c, 530, 4, 23481);
    			add_location(p93, file$c, 531, 4, 23555);
    			add_location(p94, file$c, 532, 4, 23582);
    			add_location(p95, file$c, 537, 4, 23819);
    			attr_dev(section23, "class", "svelte-18y9jk5");
    			add_location(section23, file$c, 521, 2, 23111);
    			attr_dev(p96, "class", "num svelte-18y9jk5");
    			add_location(p96, file$c, 546, 4, 24231);
    			add_location(p97, file$c, 547, 4, 24258);
    			attr_dev(p98, "class", "attrib svelte-18y9jk5");
    			add_location(p98, file$c, 554, 4, 24641);
    			attr_dev(section24, "class", "svelte-18y9jk5");
    			add_location(section24, file$c, 545, 2, 24217);
    			attr_dev(img4, "class", "cctv svelte-18y9jk5");
    			if (img4.src !== (img4_src_value = "/assets/images/ss5.jpg")) attr_dev(img4, "src", img4_src_value);
    			attr_dev(img4, "alt", "cctv");
    			add_location(img4, file$c, 558, 2, 24761);
    			attr_dev(p99, "class", "num svelte-18y9jk5");
    			add_location(p99, file$c, 560, 4, 24838);
    			add_location(p100, file$c, 561, 4, 24865);
    			add_location(p101, file$c, 562, 4, 24875);
    			add_location(em15, file$c, 573, 71, 25547);
    			add_location(p102, file$c, 568, 4, 25156);
    			add_location(p103, file$c, 577, 4, 25620);
    			add_location(p104, file$c, 585, 4, 26071);
    			add_location(p105, file$c, 586, 4, 26088);
    			add_location(p106, file$c, 593, 4, 26478);
    			add_location(p107, file$c, 594, 4, 26498);
    			add_location(p108, file$c, 595, 4, 26554);
    			add_location(p109, file$c, 596, 4, 26609);
    			add_location(p110, file$c, 597, 4, 26666);
    			add_location(p111, file$c, 604, 4, 27049);
    			add_location(p112, file$c, 608, 4, 27174);
    			attr_dev(section25, "class", "svelte-18y9jk5");
    			add_location(section25, file$c, 559, 2, 24824);
    			attr_dev(p113, "class", "num svelte-18y9jk5");
    			add_location(p113, file$c, 611, 4, 27250);
    			add_location(em16, file$c, 613, 33, 27314);
    			add_location(p114, file$c, 612, 4, 27277);
    			add_location(p115, file$c, 620, 4, 27726);
    			add_location(p116, file$c, 625, 4, 27922);
    			add_location(em17, file$c, 631, 63, 28172);
    			add_location(p117, file$c, 630, 4, 28105);
    			add_location(p118, file$c, 634, 4, 28244);
    			add_location(p119, file$c, 635, 4, 28302);
    			add_location(p120, file$c, 636, 4, 28375);
    			add_location(p121, file$c, 641, 4, 28577);
    			add_location(p122, file$c, 649, 4, 29007);
    			add_location(p123, file$c, 653, 4, 29135);
    			add_location(p124, file$c, 658, 4, 29351);
    			add_location(p125, file$c, 659, 4, 29397);
    			add_location(p126, file$c, 663, 4, 29554);
    			attr_dev(section26, "class", "svelte-18y9jk5");
    			add_location(section26, file$c, 610, 2, 27236);
    			attr_dev(p127, "class", "num svelte-18y9jk5");
    			add_location(p127, file$c, 669, 4, 29711);
    			add_location(p128, file$c, 670, 4, 29738);
    			add_location(p129, file$c, 676, 4, 30008);
    			add_location(p130, file$c, 681, 4, 30243);
    			attr_dev(section27, "class", "svelte-18y9jk5");
    			add_location(section27, file$c, 668, 2, 29697);
    			attr_dev(p131, "class", "num svelte-18y9jk5");
    			add_location(p131, file$c, 691, 4, 30729);
    			add_location(p132, file$c, 692, 4, 30756);
    			attr_dev(section28, "class", "svelte-18y9jk5");
    			add_location(section28, file$c, 690, 2, 30715);
    			attr_dev(img5, "class", "cctv svelte-18y9jk5");
    			if (img5.src !== (img5_src_value = "/assets/images/ss6.jpg")) attr_dev(img5, "src", img5_src_value);
    			attr_dev(img5, "alt", "cctv");
    			add_location(img5, file$c, 697, 2, 30880);
    			attr_dev(p133, "class", "num svelte-18y9jk5");
    			add_location(p133, file$c, 699, 4, 30957);
    			add_location(p134, file$c, 700, 4, 30984);
    			add_location(p135, file$c, 708, 4, 31429);
    			add_location(p136, file$c, 709, 4, 31464);
    			add_location(p137, file$c, 720, 4, 32137);
    			add_location(p138, file$c, 725, 4, 32383);
    			add_location(p139, file$c, 726, 4, 32416);
    			add_location(p140, file$c, 730, 4, 32556);
    			add_location(br7, file$c, 731, 7, 32618);
    			add_location(p141, file$c, 731, 4, 32615);
    			set_style(p142, "text-align", "center");
    			add_location(p142, file$c, 732, 4, 32633);
    			attr_dev(section29, "class", "svelte-18y9jk5");
    			add_location(section29, file$c, 698, 2, 30943);
    			attr_dev(div0, "class", "text");
    			add_location(div0, file$c, 34, 0, 899);
    			add_location(em18, file$c, 738, 4, 32734);
    			attr_dev(a0, "href", "https://www.bansheelit.com/");
    			add_location(a0, file$c, 740, 8, 32829);
    			add_location(em19, file$c, 740, 4, 32825);
    			add_location(p143, file$c, 737, 2, 32726);
    			add_location(em20, file$c, 744, 34, 33010);
    			add_location(em21, file$c, 745, 4, 33041);
    			add_location(em22, file$c, 745, 26, 33063);
    			add_location(em23, file$c, 745, 55, 33092);
    			add_location(em24, file$c, 748, 4, 33259);
    			add_location(p144, file$c, 742, 2, 32894);
    			add_location(p145, file$c, 751, 2, 33385);
    			attr_dev(a1, "href", "meabhdebrun.org");
    			add_location(a1, file$c, 756, 5, 33618);
    			add_location(p146, file$c, 756, 2, 33615);
    			attr_dev(div1, "class", "credits text svelte-18y9jk5");
    			add_location(div1, file$c, 736, 0, 32697);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(articleheader, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(audioplayer, target, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div0, anchor);
    			append_dev(div0, section0);
    			append_dev(section0, p0);
    			append_dev(section0, t3);
    			append_dev(section0, p1);
    			append_dev(section0, t5);
    			append_dev(section0, p2);
    			append_dev(section0, t7);
    			append_dev(section0, p3);
    			append_dev(div0, t9);
    			append_dev(div0, section1);
    			append_dev(section1, p4);
    			append_dev(section1, t11);
    			append_dev(section1, p5);
    			append_dev(div0, t13);
    			append_dev(div0, section2);
    			append_dev(section2, p6);
    			append_dev(section2, t15);
    			append_dev(section2, p7);
    			append_dev(p7, strong0);
    			append_dev(p7, br0);
    			append_dev(p7, t17);
    			append_dev(p7, br1);
    			append_dev(p7, em0);
    			append_dev(p7, br2);
    			append_dev(p7, t19);
    			append_dev(div0, t20);
    			append_dev(div0, section3);
    			append_dev(section3, p8);
    			append_dev(section3, t22);
    			append_dev(section3, p9);
    			append_dev(section3, t24);
    			append_dev(section3, p10);
    			append_dev(section3, t26);
    			append_dev(section3, p11);
    			append_dev(div0, t28);
    			append_dev(div0, section4);
    			append_dev(section4, p12);
    			append_dev(section4, t30);
    			append_dev(section4, p13);
    			append_dev(p13, strong1);
    			append_dev(strong1, t31);
    			append_dev(strong1, br3);
    			append_dev(strong1, t32);
    			append_dev(section4, t33);
    			append_dev(section4, p14);
    			append_dev(section4, t35);
    			append_dev(section4, p15);
    			append_dev(div0, t37);
    			append_dev(div0, section5);
    			append_dev(section5, p16);
    			append_dev(section5, t39);
    			append_dev(section5, p17);
    			append_dev(section5, t41);
    			append_dev(section5, p18);
    			append_dev(section5, t43);
    			append_dev(section5, p19);
    			append_dev(section5, t45);
    			append_dev(section5, p20);
    			append_dev(section5, t47);
    			append_dev(section5, p21);
    			append_dev(section5, t49);
    			append_dev(section5, p22);
    			append_dev(p22, t50);
    			append_dev(p22, em1);
    			append_dev(div0, t52);
    			append_dev(div0, img0);
    			append_dev(div0, t53);
    			append_dev(div0, section6);
    			append_dev(section6, p23);
    			append_dev(section6, t55);
    			append_dev(section6, p24);
    			append_dev(p24, t56);
    			append_dev(p24, em2);
    			append_dev(p24, t58);
    			append_dev(p24, em3);
    			append_dev(p24, t60);
    			append_dev(p24, em4);
    			append_dev(p24, t62);
    			append_dev(div0, t63);
    			append_dev(div0, section7);
    			append_dev(section7, p25);
    			append_dev(section7, t65);
    			append_dev(section7, p26);
    			append_dev(div0, t67);
    			append_dev(div0, section8);
    			append_dev(section8, p27);
    			append_dev(section8, t69);
    			append_dev(section8, p28);
    			append_dev(section8, t71);
    			append_dev(section8, p29);
    			append_dev(div0, t73);
    			append_dev(div0, section9);
    			append_dev(section9, p30);
    			append_dev(section9, t75);
    			append_dev(section9, p31);
    			append_dev(div0, t77);
    			append_dev(div0, section10);
    			append_dev(section10, p32);
    			append_dev(section10, t79);
    			append_dev(section10, p33);
    			append_dev(section10, t81);
    			append_dev(section10, p34);
    			append_dev(div0, t83);
    			append_dev(div0, img1);
    			append_dev(div0, t84);
    			append_dev(div0, section11);
    			append_dev(section11, p35);
    			append_dev(section11, t86);
    			append_dev(section11, p36);
    			append_dev(p36, t87);
    			append_dev(p36, em5);
    			append_dev(p36, t89);
    			append_dev(p36, em6);
    			append_dev(p36, t91);
    			append_dev(p36, em7);
    			append_dev(p36, t93);
    			append_dev(section11, t94);
    			append_dev(section11, p37);
    			append_dev(section11, t96);
    			append_dev(section11, p38);
    			append_dev(section11, t98);
    			append_dev(section11, p39);
    			append_dev(div0, t100);
    			append_dev(div0, section12);
    			append_dev(section12, p40);
    			append_dev(section12, t102);
    			append_dev(section12, p41);
    			append_dev(section12, t104);
    			append_dev(section12, p42);
    			append_dev(section12, t106);
    			append_dev(section12, p43);
    			append_dev(section12, t108);
    			append_dev(section12, p44);
    			append_dev(div0, t110);
    			append_dev(div0, section13);
    			append_dev(section13, p45);
    			append_dev(section13, t112);
    			append_dev(section13, p46);
    			append_dev(section13, t114);
    			append_dev(section13, p47);
    			append_dev(section13, t116);
    			append_dev(section13, p48);
    			append_dev(section13, t118);
    			append_dev(section13, p49);
    			append_dev(div0, t120);
    			append_dev(div0, section14);
    			append_dev(section14, p50);
    			append_dev(section14, t122);
    			append_dev(section14, p51);
    			append_dev(p51, em8);
    			append_dev(p51, br4);
    			append_dev(p51, t124);
    			append_dev(p51, br5);
    			append_dev(p51, strong2);
    			append_dev(p51, br6);
    			append_dev(p51, em9);
    			append_dev(section14, t127);
    			append_dev(section14, p52);
    			append_dev(section14, t129);
    			append_dev(section14, p53);
    			append_dev(section14, t131);
    			append_dev(section14, p54);
    			append_dev(section14, t133);
    			append_dev(section14, p55);
    			append_dev(div0, t135);
    			append_dev(div0, img2);
    			append_dev(div0, t136);
    			append_dev(div0, section15);
    			append_dev(section15, p56);
    			append_dev(section15, t138);
    			append_dev(section15, p57);
    			append_dev(p57, t139);
    			append_dev(p57, em10);
    			append_dev(p57, t141);
    			append_dev(p57, em11);
    			append_dev(p57, t143);
    			append_dev(div0, t144);
    			append_dev(div0, section16);
    			append_dev(section16, p58);
    			append_dev(section16, t146);
    			append_dev(section16, p59);
    			append_dev(section16, t148);
    			append_dev(section16, p60);
    			append_dev(section16, t150);
    			append_dev(section16, p61);
    			append_dev(div0, t152);
    			append_dev(div0, section17);
    			append_dev(section17, p62);
    			append_dev(section17, t154);
    			append_dev(section17, p63);
    			append_dev(section17, t156);
    			append_dev(section17, ul);
    			append_dev(ul, li0);
    			append_dev(ul, t158);
    			append_dev(ul, li1);
    			append_dev(ul, t160);
    			append_dev(ul, li2);
    			append_dev(ul, t162);
    			append_dev(ul, li3);
    			append_dev(ul, t164);
    			append_dev(ul, li4);
    			append_dev(section17, t166);
    			append_dev(section17, p64);
    			append_dev(section17, t168);
    			append_dev(section17, p65);
    			append_dev(div0, t170);
    			append_dev(div0, section18);
    			append_dev(section18, p66);
    			append_dev(section18, t172);
    			append_dev(section18, p67);
    			append_dev(section18, t174);
    			append_dev(section18, p68);
    			append_dev(section18, t176);
    			append_dev(section18, p69);
    			append_dev(section18, t178);
    			append_dev(section18, p70);
    			append_dev(section18, t180);
    			append_dev(section18, p71);
    			append_dev(section18, t182);
    			append_dev(section18, p72);
    			append_dev(div0, t184);
    			append_dev(div0, section19);
    			append_dev(section19, p73);
    			append_dev(section19, t186);
    			append_dev(section19, p74);
    			append_dev(p74, strong3);
    			append_dev(section19, t188);
    			append_dev(section19, ol);
    			append_dev(ol, li5);
    			append_dev(ol, t190);
    			append_dev(ol, li6);
    			append_dev(ol, t192);
    			append_dev(ol, li7);
    			append_dev(ol, t194);
    			append_dev(ol, li8);
    			append_dev(ol, t196);
    			append_dev(ol, li9);
    			append_dev(ol, t198);
    			append_dev(ol, li10);
    			append_dev(ol, t200);
    			append_dev(ol, li11);
    			append_dev(ol, t202);
    			append_dev(ol, li12);
    			append_dev(ol, t204);
    			append_dev(ol, li13);
    			append_dev(div0, t206);
    			append_dev(div0, img3);
    			append_dev(div0, t207);
    			append_dev(div0, section20);
    			append_dev(section20, p75);
    			append_dev(section20, t209);
    			append_dev(section20, p76);
    			append_dev(section20, t211);
    			append_dev(section20, p77);
    			append_dev(section20, t213);
    			append_dev(section20, p78);
    			append_dev(p78, t214);
    			append_dev(p78, em12);
    			append_dev(p78, t216);
    			append_dev(section20, t217);
    			append_dev(section20, p79);
    			append_dev(div0, t219);
    			append_dev(div0, section21);
    			append_dev(section21, p80);
    			append_dev(section21, t221);
    			append_dev(section21, p81);
    			append_dev(div0, t223);
    			append_dev(div0, section22);
    			append_dev(section22, p82);
    			append_dev(section22, t225);
    			append_dev(section22, p83);
    			append_dev(section22, t227);
    			append_dev(section22, p84);
    			append_dev(section22, t229);
    			append_dev(section22, p85);
    			append_dev(p85, t230);
    			append_dev(p85, em13);
    			append_dev(p85, t232);
    			append_dev(section22, t233);
    			append_dev(section22, p86);
    			append_dev(p86, t234);
    			append_dev(p86, em14);
    			append_dev(section22, t236);
    			append_dev(section22, p87);
    			append_dev(section22, t238);
    			append_dev(section22, p88);
    			append_dev(div0, t240);
    			append_dev(div0, section23);
    			append_dev(section23, p89);
    			append_dev(section23, t242);
    			append_dev(section23, p90);
    			append_dev(section23, t244);
    			append_dev(section23, p91);
    			append_dev(section23, t246);
    			append_dev(section23, p92);
    			append_dev(section23, t248);
    			append_dev(section23, p93);
    			append_dev(section23, t250);
    			append_dev(section23, p94);
    			append_dev(section23, t252);
    			append_dev(section23, p95);
    			append_dev(div0, t254);
    			append_dev(div0, section24);
    			append_dev(section24, p96);
    			append_dev(section24, t256);
    			append_dev(section24, p97);
    			append_dev(section24, t258);
    			append_dev(section24, p98);
    			append_dev(div0, t260);
    			append_dev(div0, img4);
    			append_dev(div0, t261);
    			append_dev(div0, section25);
    			append_dev(section25, p99);
    			append_dev(section25, t263);
    			append_dev(section25, p100);
    			append_dev(section25, t264);
    			append_dev(section25, p101);
    			append_dev(section25, t266);
    			append_dev(section25, p102);
    			append_dev(p102, t267);
    			append_dev(p102, em15);
    			append_dev(section25, t269);
    			append_dev(section25, p103);
    			append_dev(section25, t271);
    			append_dev(section25, p104);
    			append_dev(section25, t273);
    			append_dev(section25, p105);
    			append_dev(section25, t275);
    			append_dev(section25, p106);
    			append_dev(section25, t277);
    			append_dev(section25, p107);
    			append_dev(section25, t279);
    			append_dev(section25, p108);
    			append_dev(section25, t281);
    			append_dev(section25, p109);
    			append_dev(section25, t283);
    			append_dev(section25, p110);
    			append_dev(section25, t285);
    			append_dev(section25, p111);
    			append_dev(section25, t287);
    			append_dev(section25, p112);
    			append_dev(div0, t289);
    			append_dev(div0, section26);
    			append_dev(section26, p113);
    			append_dev(section26, t291);
    			append_dev(section26, p114);
    			append_dev(p114, t292);
    			append_dev(p114, em16);
    			append_dev(p114, t294);
    			append_dev(section26, t295);
    			append_dev(section26, p115);
    			append_dev(section26, t297);
    			append_dev(section26, p116);
    			append_dev(section26, t299);
    			append_dev(section26, p117);
    			append_dev(p117, t300);
    			append_dev(p117, em17);
    			append_dev(p117, t302);
    			append_dev(section26, t303);
    			append_dev(section26, p118);
    			append_dev(section26, t305);
    			append_dev(section26, p119);
    			append_dev(section26, t307);
    			append_dev(section26, p120);
    			append_dev(section26, t309);
    			append_dev(section26, p121);
    			append_dev(section26, t311);
    			append_dev(section26, p122);
    			append_dev(section26, t313);
    			append_dev(section26, p123);
    			append_dev(section26, t315);
    			append_dev(section26, p124);
    			append_dev(section26, t317);
    			append_dev(section26, p125);
    			append_dev(section26, t319);
    			append_dev(section26, p126);
    			append_dev(div0, t321);
    			append_dev(div0, section27);
    			append_dev(section27, p127);
    			append_dev(section27, t323);
    			append_dev(section27, p128);
    			append_dev(section27, t325);
    			append_dev(section27, p129);
    			append_dev(section27, t327);
    			append_dev(section27, p130);
    			append_dev(div0, t329);
    			append_dev(div0, section28);
    			append_dev(section28, p131);
    			append_dev(section28, t331);
    			append_dev(section28, p132);
    			append_dev(div0, t333);
    			append_dev(div0, img5);
    			append_dev(div0, t334);
    			append_dev(div0, section29);
    			append_dev(section29, p133);
    			append_dev(section29, t336);
    			append_dev(section29, p134);
    			append_dev(section29, t338);
    			append_dev(section29, p135);
    			append_dev(section29, t340);
    			append_dev(section29, p136);
    			append_dev(section29, t342);
    			append_dev(section29, p137);
    			append_dev(section29, t344);
    			append_dev(section29, p138);
    			append_dev(section29, t346);
    			append_dev(section29, p139);
    			append_dev(section29, t348);
    			append_dev(section29, p140);
    			append_dev(section29, t350);
    			append_dev(section29, p141);
    			append_dev(p141, br7);
    			append_dev(section29, t351);
    			append_dev(section29, p142);
    			insert_dev(target, t353, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, p143);
    			append_dev(p143, em18);
    			append_dev(p143, t355);
    			append_dev(p143, em19);
    			append_dev(em19, a0);
    			append_dev(p143, t357);
    			append_dev(div1, t358);
    			append_dev(div1, p144);
    			append_dev(p144, t359);
    			append_dev(p144, em20);
    			append_dev(p144, t361);
    			append_dev(p144, em21);
    			append_dev(p144, t363);
    			append_dev(p144, em22);
    			append_dev(p144, t365);
    			append_dev(p144, em23);
    			append_dev(p144, t367);
    			append_dev(p144, em24);
    			append_dev(p144, t369);
    			append_dev(div1, t370);
    			append_dev(div1, p145);
    			append_dev(div1, t372);
    			append_dev(div1, p146);
    			append_dev(p146, a1);
    			current = true;
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			const articleheader_changes = {};

    			if (!updating_audioActive && dirty & /*audioActive*/ 1) {
    				updating_audioActive = true;
    				articleheader_changes.audioActive = /*audioActive*/ ctx[0];
    				add_flush_callback(() => updating_audioActive = false);
    			}

    			articleheader.$set(articleheader_changes);
    			const audioplayer_changes = {};
    			if (dirty & /*audioActive*/ 1) audioplayer_changes.active = /*audioActive*/ ctx[0];
    			audioplayer.$set(audioplayer_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(articleheader.$$.fragment, local);
    			transition_in(audioplayer.$$.fragment, local);

    			add_render_callback(() => {
    				if (div0_outro) div0_outro.end(1);

    				if (!div0_intro) div0_intro = create_in_transition(div0, blur, {
    					delay: 100,
    					duration: 800,
    					amount: 10,
    					easing: identity
    				});

    				div0_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(articleheader.$$.fragment, local);
    			transition_out(audioplayer.$$.fragment, local);
    			if (div0_intro) div0_intro.invalidate();

    			div0_outro = create_out_transition(div0, blur, {
    				delay: 0,
    				duration: 600,
    				amount: 10,
    				easing: identity
    			});

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(articleheader, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(audioplayer, detaching);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div0);
    			if (detaching && div0_outro) div0_outro.end();
    			if (detaching) detach_dev(t353);
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("SaintSisters", slots, []);

    	onMount(() => {
    		document.title = "View Source | 'Saint Sisters & The Sea' – Méabh de Brún";
    		let blobs = document.querySelectorAll(".blob");
    		[...blobs].forEach(el => move(el));
    		themeColour.update(theme => "#f8fff1");
    		blob1.update(c => "#f290a280");
    	});

    	let audioActive = false;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<SaintSisters> was created with unknown prop '${key}'`);
    	});

    	function articleheader_audioActive_binding(value) {
    		audioActive = value;
    		$$invalidate(0, audioActive);
    	}

    	$$self.$capture_state = () => ({
    		blur,
    		linear: identity,
    		AudioPlayer,
    		ArticleHeader,
    		onMount,
    		themeColour,
    		blob1,
    		move,
    		audioActive
    	});

    	$$self.$inject_state = $$props => {
    		if ("audioActive" in $$props) $$invalidate(0, audioActive = $$props.audioActive);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [audioActive, articleheader_audioActive_binding];
    }

    class SaintSisters extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SaintSisters",
    			options,
    			id: create_fragment$e.name
    		});
    	}
    }

    /* src/routes/pieces/Electric.svelte generated by Svelte v3.32.3 */
    const file$d = "src/routes/pieces/Electric.svelte";

    function create_fragment$f(ctx) {
    	let articleheader;
    	let updating_audioActive;
    	let t0;
    	let audioplayer;
    	let t1;
    	let div33;
    	let span0;
    	let t3;
    	let span1;
    	let t5;
    	let p0;
    	let span2;
    	let t7;
    	let div0;
    	let img;
    	let img_src_value;
    	let t8;
    	let span3;
    	let t10;
    	let span4;
    	let t11;
    	let br0;
    	let t12;
    	let br1;
    	let t13;
    	let br2;
    	let t14;
    	let br3;
    	let t15;
    	let t16;
    	let span5;
    	let strong0;
    	let br4;
    	let t18;
    	let t19;
    	let p1;
    	let span6;
    	let strong1;
    	let br5;
    	let t21;
    	let t22;
    	let span7;
    	let t24;
    	let span8;
    	let t26;
    	let span9;
    	let t28;
    	let span10;
    	let t30;
    	let span11;
    	let t32;
    	let span12;
    	let t34;
    	let span13;
    	let t36;
    	let span14;
    	let t38;
    	let span15;
    	let t40;
    	let span16;
    	let t42;
    	let span17;
    	let t44;
    	let span18;
    	let t46;
    	let span19;
    	let t48;
    	let span20;
    	let t50;
    	let span21;
    	let t52;
    	let span22;
    	let t54;
    	let span23;
    	let t56;
    	let span24;
    	let t58;
    	let span25;
    	let t60;
    	let span26;
    	let t62;
    	let span27;
    	let t64;
    	let span28;
    	let t66;
    	let span29;
    	let t68;
    	let span30;
    	let t70;
    	let span31;
    	let t72;
    	let span32;
    	let t74;
    	let span33;
    	let t76;
    	let span34;
    	let t78;
    	let span35;
    	let t80;
    	let span36;
    	let t82;
    	let span37;
    	let t84;
    	let span38;
    	let t86;
    	let span39;
    	let t88;
    	let span40;
    	let t90;
    	let span41;
    	let t92;
    	let span42;
    	let t94;
    	let span43;
    	let t96;
    	let span44;
    	let t98;
    	let span45;
    	let t100;
    	let span46;
    	let t102;
    	let span47;
    	let t104;
    	let span48;
    	let t106;
    	let span49;
    	let t108;
    	let span50;
    	let t110;
    	let span51;
    	let t112;
    	let span52;
    	let t114;
    	let span53;
    	let t116;
    	let span54;
    	let t118;
    	let span55;
    	let t120;
    	let span56;
    	let t122;
    	let span57;
    	let t124;
    	let span58;
    	let t126;
    	let span59;
    	let t128;
    	let span60;
    	let t130;
    	let span61;
    	let t132;
    	let span62;
    	let t134;
    	let span63;
    	let t136;
    	let span64;
    	let t138;
    	let span65;
    	let t140;
    	let span66;
    	let t142;
    	let span67;
    	let t144;
    	let span68;
    	let t146;
    	let span69;
    	let t148;
    	let span70;
    	let t150;
    	let span71;
    	let t152;
    	let span72;
    	let t154;
    	let span73;
    	let t156;
    	let span74;
    	let t158;
    	let span75;
    	let t160;
    	let span76;
    	let t162;
    	let span77;
    	let t164;
    	let span78;
    	let t166;
    	let span79;
    	let t168;
    	let span80;
    	let t170;
    	let span81;
    	let t172;
    	let span82;
    	let t174;
    	let span83;
    	let t176;
    	let span84;
    	let t178;
    	let span85;
    	let t180;
    	let span86;
    	let t182;
    	let span87;
    	let t184;
    	let span88;
    	let t186;
    	let span89;
    	let t188;
    	let span90;
    	let t190;
    	let span91;
    	let t192;
    	let span92;
    	let t194;
    	let span93;
    	let t196;
    	let span94;
    	let t198;
    	let span95;
    	let t200;
    	let span96;
    	let t202;
    	let span97;
    	let t204;
    	let span98;
    	let t206;
    	let span99;
    	let t208;
    	let span100;
    	let t210;
    	let span101;
    	let t212;
    	let span102;
    	let t214;
    	let span103;
    	let t216;
    	let span104;
    	let t218;
    	let section;
    	let h1;
    	let t220;
    	let div4;
    	let div1;
    	let t222;
    	let div2;
    	let t224;
    	let div3;
    	let button0;
    	let button1;
    	let button2;
    	let button3;
    	let t229;
    	let div8;
    	let div5;
    	let t231;
    	let div6;
    	let t233;
    	let div7;
    	let button4;
    	let button5;
    	let button6;
    	let button7;
    	let t238;
    	let div12;
    	let div9;
    	let t240;
    	let div10;
    	let t242;
    	let div11;
    	let button8;
    	let button9;
    	let button10;
    	let button11;
    	let t247;
    	let div16;
    	let div13;
    	let t249;
    	let div14;
    	let t251;
    	let div15;
    	let button12;
    	let button13;
    	let button14;
    	let button15;
    	let t256;
    	let div20;
    	let div17;
    	let t258;
    	let div18;
    	let t260;
    	let div19;
    	let button16;
    	let button17;
    	let button18;
    	let button19;
    	let t265;
    	let div24;
    	let div21;
    	let t267;
    	let div22;
    	let t269;
    	let div23;
    	let button20;
    	let button21;
    	let button22;
    	let button23;
    	let t274;
    	let div28;
    	let div25;
    	let t276;
    	let div26;
    	let t278;
    	let div27;
    	let button24;
    	let button25;
    	let button26;
    	let button27;
    	let t283;
    	let div32;
    	let div29;
    	let t285;
    	let div30;
    	let t287;
    	let div31;
    	let button28;
    	let button29;
    	let button30;
    	let button31;
    	let t292;
    	let span105;
    	let t294;
    	let span106;
    	let t296;
    	let span107;
    	let t298;
    	let span108;
    	let t300;
    	let span109;
    	let t302;
    	let span110;
    	let t304;
    	let span111;
    	let t306;
    	let span112;
    	let t308;
    	let span113;
    	let t310;
    	let span114;
    	let div33_intro;
    	let div33_outro;
    	let t312;
    	let div34;
    	let p2;
    	let em0;
    	let t314;
    	let em1;
    	let a;
    	let t316;
    	let t317;
    	let p3;
    	let t318;
    	let em2;
    	let t320;
    	let em3;
    	let t322;
    	let em4;
    	let t324;
    	let current;

    	function articleheader_audioActive_binding(value) {
    		/*articleheader_audioActive_binding*/ ctx[1](value);
    	}

    	let articleheader_props = {
    		title: "Getting The Electric",
    		author: "Louise Hegarty"
    	};

    	if (/*audioActive*/ ctx[0] !== void 0) {
    		articleheader_props.audioActive = /*audioActive*/ ctx[0];
    	}

    	articleheader = new ArticleHeader({
    			props: articleheader_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(articleheader, "audioActive", articleheader_audioActive_binding));

    	audioplayer = new AudioPlayer({
    			props: {
    				src: "/assets/audio/electric.mp3",
    				active: /*audioActive*/ ctx[0],
    				credits: "Composed and performed by Maija Sofia."
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(articleheader.$$.fragment);
    			t0 = space();
    			create_component(audioplayer.$$.fragment);
    			t1 = space();
    			div33 = element("div");
    			span0 = element("span");
    			span0.textContent = "‘Before getting the electric, we had no running water, no refrigeration, no\n    machine for washing. We were bound to daylight hours. Electricity meant\n    parish hall dances and colour and fun. It was a release from the drudgery.\n    It meant we could finally see ourselves.’";
    			t3 = space();
    			span1 = element("span");
    			span1.textContent = "The first induction coil was invented in 1836 by Nicholas Callan, a priest\n    and scientist from Louth. This early form of transformer contributed greatly\n    to the widespread distribution of electricity throughout the world.";
    			t5 = space();
    			p0 = element("p");
    			span2 = element("span");
    			span2.textContent = "The advantages of electricity to the agricultural industry and the\n      day-to-day lives of farmers would be undeniably immense. It would lead to\n      an improvement in hygiene and safety standards, the simplifying of many\n      daily tasks and a rise in efficiency, which would result in greater\n      profits. It would also make rural Ireland an attractive site for new\n      industries. It is imperative therefore that such a scheme begins without\n      further delay. - 'Electricity in Rural Ireland' by A. Byrne published in\n      Muintir na Tíre (Issue 22, March 1929, p.8)";
    			t7 = space();
    			div0 = element("div");
    			img = element("img");
    			t8 = space();
    			span3 = element("span");
    			span3.textContent = "Thomas McLaughlin (1896 - 1971) was born in Drogheda. After studying in UCD\n    and UCG, McLaughlin moved to Berlin in 1922 to work for the German\n    electrical engineering company Siemens-Schuckert. He returned to Ireland in\n    December 1923 where he became one of the key figures in the Shannon\n    hydroelectric scheme. He later became the executive director of the ESB.";
    			t10 = space();
    			span4 = element("span");
    			t11 = text("In Cavan there was a great fire,");
    			br0 = element("br");
    			t12 = text(" Judge McCarthy was sent to inquire,");
    			br1 = element("br");
    			t13 = text("\n    It would be a shame, if the nuns were to blame,");
    			br2 = element("br");
    			t14 = text(" So it had to be caused\n    by a wire.");
    			br3 = element("br");
    			t15 = text(" — Flann O’Brien & Tom O’Higgins");
    			t16 = space();
    			span5 = element("span");
    			strong0 = element("strong");
    			strong0.textContent = "In our country, electrification is more than merely producing light or\n      power. It is bringing light into darkness… we are going to put into the\n      homes of our people in rural areas a light which will light up their minds\n      as well as their homes. If we do that, we will have brought a new\n      atmosphere and a new outlook to many of these people.";
    			br4 = element("br");
    			t18 = text(" — James Larkin Jnr, TD, speaking during the Second Stage debate on the\n    Electricity Supply (Amendment) Bill, 1944");
    			t19 = space();
    			p1 = element("p");
    			span6 = element("span");
    			strong1 = element("strong");
    			strong1.textContent = "Customs-Free Airport Act, 1947";
    			br5 = element("br");
    			t21 = text(" 2.—(1) The Minister,\n      with the concurrence of the Minister for Finance, may by order declare that,\n      on and after a specified date, the land enclosed within the limits defined\n      by the order shall be the Customs-free airport for the purposes of this Act.\n      (2) The Minister, with the concurrence of the Minister for Finance, may from\n      time to time by order amend the order under subsection (1) of this section\n      by varying the limits of the airport. (3) The airport shall comprise only land\n      which for the time being belongs to the State.");
    			t22 = space();
    			span7 = element("span");
    			span7.textContent = "The Rural Area Organiser was an important figure in developing the\n    relationship between the ESB and local people. The job involved encouraging\n    householders to sign up to the scheme as well as advising on the purchase of\n    electrical appliances.";
    			t24 = space();
    			span8 = element("span");
    			span8.textContent = "AN ACT TO MAKE PROVISION FOR THE FORMATION AND REGISTRATION OF A COMPANY\n    HAVING FOR ITS PRINCIPAL OBJECTS THE ACQUISITION, ERECTION, AND OPERATION OF\n    SUGAR FACTORIES IN SAORSTÁT ÉIREANN, AND TO PROVIDE FOR THE ACQUISITION BY\n    THE MINISTER FOR FINANCE OF SHARE CAPITAL OF SUCH COMPANY, FOR THE GIVING OF\n    GUARANTEES BY THE STATE IN RELATION TO DEBENTURES ISSUED BY SUCH COMPANY,\n    FOR THE COMPULSORY ACQUISITION OF LAND AND THE CONSTRUCTION, MAINTENANCE,\n    AND OPERATION OF TRANSPORT WORKS BY SUCH COMPANY, AND FOR OTHER MATTERS\n    CONNECTED WITH THE MATTERS AFORESAID. [23rd August, 1933.]";
    			t26 = space();
    			span9 = element("span");
    			span9.textContent = "Once upon a time there was a man and a woman who lived with their two\n    children—a girl and a boy—on a small farm. Beside their house was a fairy\n    fort. The woman was pregnant with a child and late one night she gave birth\n    to a little boy. They warned the two older children never to leave the\n    window to the bedroom open in case a fairy entered and took the baby, who\n    was vulnerable… - The Changeling transcribed by a member of our volunteer\n    transcription project, duchas.ie";
    			t28 = space();
    			span10 = element("span");
    			span10.textContent = "… I hope to see the day that when a girl gets a proposal from a farmer she\n    will inquire not so much about the number of cows, but rather concerning the\n    electrical appliances that she will require before she gives her consent,\n    including not merely electric light but a water heater, an electric clothes\n    boiler, a vacuum cleaner and even a refrigerator. - Minister Seán Lemass\n    speaking during the Second Stage debate on the Electricity Supply\n    (Amendment) Bill, 1944";
    			t30 = space();
    			span11 = element("span");
    			span11.textContent = "What does rural electrification mean to you? How can you get it to your\n    house and farmyard?";
    			t32 = space();
    			span12 = element("span");
    			span12.textContent = "The switching on ceremony was an important part of the process and\n    generally featured a dance, a dinner and speeches from local politicians,\n    members of the clergy and representatives of the ESB. - Switching on: A\n    History of Rural Electrification in Ireland by John Swanzy (Mweelrea Press,\n    2016)";
    			t34 = space();
    			span13 = element("span");
    			span13.textContent = "Virginia O’Brien (1898 - 1988) was the longest serving chairwoman of the\n    Irish Countrywomen’s Association. During her lifetime she witnessed\n    significant changes in the lives of rural Irish people: the advent of\n    independence, the rural electrification scheme and membership of the EEC.\n    She was married to Frank O’Brien until his death and they had five children\n    together.";
    			t36 = space();
    			span14 = element("span");
    			span14.textContent = "This is the tenth issue of the staff magazine and we are now well into the\n    swing of things. We have completed at least one area in each county with\n    some counties already having completed two or three. Before the end of this\n    year we will be adding another five construction crews to the ten already\n    working in the field. Shortly, we will also be increasing the number and\n    variety of appliances available in our showroom - Editor’s Letter, REO News\n    (vol. 10, September 1948, p1)";
    			t38 = space();
    			span15 = element("span");
    			span15.textContent = "A backslider was a householder who had initially signed up for the\n    electricity scheme but who changed their minds once crews arrived.";
    			t40 = space();
    			span16 = element("span");
    			span16.textContent = "THE REPUBLIC OF IRELAND ACT, 1948 AN ACT TO REPEAL THE EXECUTIVE AUTHORITY\n    (EXTERNAL RELATIONS) ACT 1936, TO DECLARE THAT THE DESCRIPTION F THE STATE\n    SHALL BE THE REPUBLIC OF IRELAND, AND TO ENABLE THE PRESIDENT TO EXERCISE\n    THE EXECUTIVE POWER OR ANY EXECUTIVE FUNCTION OF THE STATE IN OR IN\n    CONNECTION WITH ITS EXTERNAL RELATIONS. [21ST DECEMBER, 1948] BE IT ENACTED\n    BY THE OIREACHTAS AS FOLLOWS:—";
    			t42 = space();
    			span17 = element("span");
    			span17.textContent = "Each area was canvassed in order to assess interest and need and to promote\n    the benefits of electricity. A majority needed to sign up to the scheme in\n    order for it to proceed. Showrooms were opened so that electrical appliances\n    could be demonstrated to the public. Routes were surveyed, budgets were\n    drawn up and then the erection of electricity poles began. - Swanzy, ibid.";
    			t44 = space();
    			span18 = element("span");
    			span18.textContent = "The key-note of Electric Water- Heating is simplicity. There is no\n    complicated ritual of turning handles at the psychological moment – you just\n    turn the hot water tap.";
    			t46 = space();
    			span19 = element("span");
    			span19.textContent = "‘They were young men. They looked like my grandsons. But they did the job\n    well. There was a lot of interest from everyone and we would all go out to\n    watch them erect poles and string cables. My wife would bring them cups of\n    tea and slices of warm brown bread.’";
    			t48 = space();
    			span20 = element("span");
    			span20.textContent = "You will want a light on in every room. Place it so as to give the best\n    light where you need it most. In some cases you might want two or more\n    lights. Make sure that your staircase light can be switched on or off from\n    either the foot of the stairs or the landing.";
    			t50 = space();
    			span21 = element("span");
    			span21.textContent = "The switching on ceremony will take place from 8 o’clock on Tuesday night\n    the 14th of October in the parish hall. There will be a blessing from Father\n    Aherne and opening speeches from Mrs O’Brien of the ICA and Mr Geary of the\n    ESB. The switching on will happen at half past nine sharp. Following this\n    there will be a dance with music provided by the West Coast Showband. PUBLIC\n    NOTICE";
    			t52 = space();
    			span22 = element("span");
    			span22.textContent = "Transcript of recording made as part of a local history project: Once it\n    was dark and the speeches were over, we put out the paraffin lights and\n    candles and the local priest switched on the big metal switch and then\n    everything was bright. Myself and Davey ran out into the street and all the\n    streetlights were on and we could run around in the dark. And we could see\n    the lights all over, up the hills and far away. The fields twinkled. When we\n    came back, we sneaked a small bit of porter and danced and got shouted at\n    because we trampled on the marigolds.";
    			t54 = space();
    			span23 = element("span");
    			span23.textContent = "Supply will be given to whole areas. An ‘area’ should be about 25 sq.\n    miles. A parish or creamery district might conveniently form the basis of\n    such an area.";
    			t56 = space();
    			span24 = element("span");
    			span24.textContent = "Statement of evidence of Garda ________ of An Garda Síochána made on the\n    16th October 1948. I hereby declare this statement is true to the best of my\n    knowledge and belief and I make it knowing that if it is tendered in\n    evidence I will be liable to prosecution if I state in it anything which I\n    know to be false or do not believe to be true. I was called to a house at\n    ______ at 12:05am on the 15th of October 1948. I spoke with a man there who\n    I know to be ___________ who resides at the residence with his wife,\n    _______, his three children and his mother-in-law. He informed me that his\n    infant child had gone missing from the house. He and his wife had been at\n    the parish hall and had returned to the house at approximately 11:20pm. He\n    says that his mother-in-law was in the house with the children while they\n    were out and that she was asleep in the back kitchen when they returned.\n    They went upstairs to check on the children and found that the youngest\n    ______ was missing. They searched the house, but he could not be found. His\n    wife then left the premises to see if he had maybe wandered into the street\n    and he followed her. The child is 2 years old and was wearing blue and white\n    pyjamas when he went to bed. He has light brown hair and blue eyes. This\n    statement has been read over by me and is correct.";
    			t58 = space();
    			span25 = element("span");
    			span25.textContent = "The entire village came out to search in laneways and ditches and\n    neighbours’ gardens and fields and graveyards. But nothing. And no-one had\n    seen anything of course because everyone had been at the switching on\n    ceremony. There was no sign of anyone having gained entry to the house. The\n    old woman downstairs never woke. The other children remained asleep in their\n    beds. It was as if the child had just disappeared into thin air. - The\n    Village in the Dark by JB Duane (New Editions, 1995)";
    			t60 = space();
    			span26 = element("span");
    			span26.textContent = "The weather has been difficult in recent weeks for crews working in the\n    West and Northwest, which has meant that we are slightly behind schedule.\n    More workers will be sent to help these crews catch up. - Editor’s Letter,\n    REO News (vol 12, November 1948, p.1)";
    			t62 = space();
    			span27 = element("span");
    			span27.textContent = "HOLY HOUR TO PRAY FOR VOCATIONS on the 24th of October from 3 o’clock to 4\n    o’clock. All are welcome—prayer followed by tea and biscuits. ANNUAL\n    COLLECTION FOR CHARITY at all Masses during November. SPECIAL MASS to be\n    held this Sunday for the _____ family. Prayers will be said for the safe\n    return of their young boy.";
    			t64 = space();
    			span28 = element("span");
    			span28.textContent = "‘Apparently she left the front door unlocked and her mother asleep\n    downstairs. The older children didn’t even wake up. Someone snuck in and\n    took the baby. And I feel terrible for them. I do. But they were very\n    careless. Leaving the children like that to go out drinking and dancing.’";
    			t66 = space();
    			span29 = element("span");
    			span29.textContent = "Statement of _______ of _______, ______ taken on the 15th of October 1948\n    at _________ by Garda ________. We, my wife _______ and I, saw ______\n    running through the street. We were on our way back from the switching on\n    ceremony. I had consumed three drinks and my wife one. We were taking our\n    time. We were admiring the new streetlights. Then we heard a woman screaming\n    and crying and my wife said, ‘is that ______?’ She knows her from the ICA.\n    And the woman was knocking on doors and was very distressed. We started to\n    walk over to her and then her husband appeared and caught up with her and\n    held her. We went to check that things were okay but obviously they weren’t.\n    I went back to the parish hall to alert Garda ________ and he accompanied me\n    back to the street. This statement has been read over by me is correct.";
    			t68 = space();
    			span30 = element("span");
    			span30.textContent = "Statement of __________ of ___________. I hereby declare this statement is\n    true to the best of my knowledge and belief and I make it knowing that if it\n    is tendered in evidence I will be liable to prosecution if I state in it\n    anything which I know to be false or do not believe to be true. I noticed a\n    man in the village in the days before the disappearance of the young boy. I\n    didn’t recognise him, which is unusual because we all know each other around\n    here. He was about 5’10” with long dark hair. He was wearing a brown jacket\n    and dark coloured pants. He didn’t seem to have washed in a couple of days.";
    			t70 = space();
    			span31 = element("span");
    			span31.textContent = "Some people may think of electricity in the home as a luxury to provide\n    comfort in various ways. This is to some extent true, but no housewife will\n    need much propaganda to convince her that its labour-saving value in the\n    domestic sphere is unchallengeable. An electric kettle will boil 12 pints of\n    water for 1d. If you compare this with any other method of boiling water you\n    will find that it is considerably cheaper and it is just as quick as any\n    other method.";
    			t72 = space();
    			span32 = element("span");
    			span32.textContent = "Transcript of recording made as part of a local history project: … And then\n    another little boy was snatched. God love us and save us. I remember praying\n    for his parents every night. They were good people. Myself and Máire joined\n    the search and we hoped that we would find something—a clue, some hope—but\n    of course we didn’t. The village was very glum. ‘Most of these cases… you\n    should look at a member of the family. That elderly woman, I never see her\n    out and about. She stays inside always. I wonder if something…’";
    			t74 = space();
    			span33 = element("span");
    			span33.textContent = "DATE MISSING: SUNDAY 5TH DECEMBER 1948 18-MONTH-OLD BOY: SEÁN HAIR COLOUR :\n    BLONDE EYE COLOUR: LIGHT BLUE LAST SEEN AT 11 O’CLOCK SUNDAY MORNING IN THE\n    FRONT GARDEN OF HIS HOME DRESSED IN CREAM TOP AND BOTTOMS PLEASE ALERT THE\n    GARDAÍ IF YOU HAVE ANY INFORMATION";
    			t76 = space();
    			span34 = element("span");
    			span34.textContent = "Gardaí are investigating whether there is any connection between the\n    abductions of two infant children from the same area. No-one has yet been\n    arrested in relation to the disappearances, but the Gardaí have started\n    re-interviewing people in the locality. They are specifically looking to\n    speak to anyone who was on New Road on the morning of the 5th of December. -\n    ‘Gardaí investigate link in missing child cases’ An Iar-Nuacht (7th December\n    1948)";
    			t78 = space();
    			span35 = element("span");
    			span35.textContent = "APPEAL FOR INFORMATION - MISSING PERSON A Garda source has informed An\n    Iar-Nuacht that they have ruled out the involvement of any ESB workers or\n    electricians in the recent disappearance of a two-year-old boy. It had been\n    reported that the Gardaí were eager to speak to anyone who had been in the\n    boy’s home in the days prior to his abduction but these men have now been\n    officially discounted as suspects. - ‘No connection between ESB and missing\n    child’ An Iar-Nuacht (20th October 1948)";
    			t80 = space();
    			span36 = element("span");
    			span36.textContent = "‘I don’t think that little boy ever left that house’";
    			t82 = space();
    			span37 = element("span");
    			span37.textContent = "Statement of ________ of _______. I hereby declare this statement is true\n    to the best of my knowledge and belief and I make it knowing that if it is\n    tendered in evidence I will be liable to prosecution if I state in it\n    anything which I know to be false or do not believe to be true. ________\n    admitted to me that he had taken the boy one night in ________ pub. He\n    laughed about it. We had consumed three pints between";
    			t84 = space();
    			span38 = element("span");
    			span38.textContent = "Everybody here today has been deeply affected by the disappearance of the\n    poor boy who was baptised in this very church. We will pray for his parents\n    and for his siblings and for his wider family. We pray also for friends and\n    neighbours, for the Gardaí and the volunteers who have been searching\n    tirelessly to bring Seán back home. - Homily of parish priest";
    			t86 = space();
    			span39 = element("span");
    			span39.textContent = "After the disappearance of the second boy, the Gardaí came under increasing\n    pressure to make an arrest. After interviewing and fingerprinting the adult\n    population of the village they set their sights on the more likely of\n    suspects: a labourer or drifter. They sought out men who had been known to\n    be working or travelling through the area and tried to connect any of them\n    to the two disappearances. - Missing: Ireland’s Vanished Children by Sorcha\n    Cahalane (W&A Publishing, 2001)";
    			t88 = space();
    			span40 = element("span");
    			span40.textContent = "LITIR UM THOGHCHÁIN An bhfuil tú cráite le polaiteoirí élite? Stop ag\n    vótáil do FG, FF, Clann na Poblachta, LAB. Tabhair do vóta don iarrthóir\n    neachspléach. Tabhair do vóta don iarrathóir fíor-Ghaelach. • Geallaim díobh\n    32-contae Éire aontaithe. Áit a bhfuil COSC ar an teanga Béarla. • Bac ar\n    fhrithchléireachas. • Táim réidh chun troid ar leith na daoine. • Bac ar\n    cistiú poiblí na páirtí politíochta. • Bac ar an gCummanachas. • Tá sé\n    soiléir san am atá inniú ann nach bhfuil meas againn ar saol an duine. Tá sé\n    tabhachtach ansan go bhfuil ionadaí againn a bhfuil sásta troid ar son\n    cearta daoine ó bhreith go bás nádúrtha. Tabhair do Vóta Uimh. 1 do Séan F\n    Verrity.";
    			t90 = space();
    			span41 = element("span");
    			span41.textContent = "Statement of ________ of ________ . I hereby declare this statement is true\n    to the best of my knowledge and belief and I make it knowing that if it is\n    tendered in evidence I will be liable to prosecution if I state in it\n    anything which I know to be false or do not believe to be true. I was woken\n    up one night just before the second child was taken—I think it was Monday—by\n    the sound of a car outside. I am a light sleeper. My wife didn’t wake. I\n    went to the window. I didn’t recognise the car. It just stopped in the\n    middle of the road with the engine running. No-one got in or out and then\n    after about five minutes it just drove off.";
    			t92 = space();
    			span42 = element("span");
    			span42.textContent = "Extract from Garda report dated the 20th of December 1948: The man said\n    that he was at home with his wife on the night in question. They live in\n    _________. He says that he may have come through the village before, but he\n    couldn’t remember. He says that he earns money doing odd jobs for people and\n    travels about a lot.";
    			t94 = space();
    			span43 = element("span");
    			span43.textContent = "… for Paraic, electricity means he can check on his animals early in the\n    mornings or in the dark winter evenings with ease. He reckons he will\n    increase his profits by at least 15% this year due to the increase in work\n    he is able to… - Extract from radio documentary on the rural electrification\n    scheme (October 1952)";
    			t96 = space();
    			span44 = element("span");
    			span44.textContent = "‘My mother saved up her egg money to buy a brand new oven. We had a nice\n    smart girl come to the house to demonstrate it for my mother. She made some\n    brown bread to make sure the oven was working. She had a lovely dress on,\n    and her hair was back from her face and I still think of it now every time I\n    smell brown bread baking.’";
    			t98 = space();
    			span45 = element("span");
    			span45.textContent = "I liked the cooker the best and I liked looking in all the cupboards. I\n    liked how shiny and new everything was. They let us plug in some of the\n    appliances to see how they worked. - Extract from an essay written by a\n    schoolchild for a competition run by the ICA";
    			t100 = space();
    			span46 = element("span");
    			span46.textContent = "2 SMALL BOYS MISSING AND yET NOTHING IS DONE THEIR aRE ThINGS THE\n    GOVERNMENT DON’T WANT U TO NO. THeIR ARe MONSTERS IN THE ELICTRICS THEir\n    TAKING ARE CHILDREN. We NEED TO PRTECT ARE FaMILies WE are BECOMIGN sick and\n    tired ARE CHILDREN ARE SICK BECAUSE O THEM lord GOD HeLP US ALL";
    			t102 = space();
    			span47 = element("span");
    			span47.textContent = "We have been thinking a lot lately about the real real-life affect our work\n    has on people’s day-to-day lives. We have seen it already: housewives who\n    now have more time for their hobbies, farmers who have increased production.\n    And we also like to believe that we have improved the quality of people’s\n    lives outside the realm of work… - Editor’s Letter, REO News (vol 16, March\n    1949, p.1)";
    			t104 = space();
    			span48 = element("span");
    			span48.textContent = "The middle-aged labourer who was arrested in connection with the recent\n    disappearances of small children has been released without charge. Since\n    October of last year two infants have been abducted from areas in the west\n    of the country. No other arrests have been made. - ‘Man released without\n    charge in baby-napping cases’ An Iar Nuacht (30th March 1949)";
    			t106 = space();
    			span49 = element("span");
    			span49.textContent = "One socket in every room is now regarded as essential for convenient living\n    - with two or three in some locations.";
    			t108 = space();
    			span50 = element("span");
    			span50.textContent = "The initial connection between the disappearances and the introduction of\n    electricity was unwittingly made by An Garda Síochána themselves. In the\n    days before the first abduction two electricians had been in the boy’s house\n    installing appliances. Gardaí interviewed these two men but they both had\n    alibis for the night in question. They were completely ruled out as suspects\n    but that tinge of doubt around the ESB never fully left the minds of some\n    villagers. - Duane, ibid.";
    			t110 = space();
    			span51 = element("span");
    			span51.textContent = "COMHAIRLE CHONTAE MINUTES OF JUNE MONTHLY MEETING OF COUNTY COUNCIL HELD IN\n    ÁRAS AN CHONTAE, ON 10TH APRIL 1949 AT 2.00 P.M.";
    			t112 = space();
    			span52 = element("span");
    			span52.textContent = "PRESENT MINISTER O’REILLY, CLLR O’DONOVAN, CLLR Ó MEALÓID, CLLR HIGGINS,\n    CLLR SINCLAIR, CLLR LYNCH, CLLR HACKETT, CLLR McGRATH, CLLR MULLANE, CLLR\n    TWOMEY, CLLR SCANLAN, CLLR PHILPOTT, CLLR FRANKS, CLLR Ó BRAONÁIN AND\n    REPRESENTATIVES OF THE ESB APOLOGIES Cllr Mullins, Cllr O’Brien, Cllr Hynes,\n    Cllr O’Sullivan CONFIRMATION OF MINUTES Minister O’Reilly spoke about the\n    need for calm heads. He expressed regret and concern for the families of the\n    missing boys. He introduced Mr Geary of the ESB to speak directly about the\n    safety of electricity in homes. Mr. F Higgins circulated information to the\n    members on the proposed budget. NOTICES OF MOTION To approve the draft deed\n    of mortgage to provide a loan for the completion of O’Mahony Park.";
    			t114 = space();
    			span53 = element("span");
    			span53.textContent = "Advice to parents: • Make sure that your doors and windows are locked and\n    bolted • Do not allow your children out after dark or to play on their own •\n    All children need to be supervised on their way to and from school • Please\n    alert the Gardaí to any suspicious activity";
    			t116 = space();
    			span54 = element("span");
    			span54.textContent = "Extract from Garda report dated the 14th of April 1949: The woman believed\n    that the child was not hers. She said that he had been swapped with another\n    child. She wanted us to take the boy into care and to issue a missing\n    persons report for her own child. She seemed to be under the impression that\n    something —‘a fairy’—had got into the house through the electricity cables\n    and had taken her child and swapped him for ‘a changeling’.";
    			t118 = space();
    			span55 = element("span");
    			span55.textContent = "This morning, the head of the ESB was being asked to clarify comments he\n    reportedly made at a private luncheon over the weekend in which he described\n    those who refused electricity as ‘backwards’ and ‘idiots’. - Radio Éireann\n    (8th May 1949)";
    			t120 = space();
    			span56 = element("span");
    			span56.textContent = "A group of men arrived at ESB headquarters in Athy yesterday morning to\n    deliver a letter on behalf of the village of D_____. The area has recently\n    suffered a number of unsolved abductions of children and these men believe\n    that the ESB have a case to answer. Some local villagers have linked the\n    disappearances to the recent switching on of electricity in the area. The\n    ESB had no comment to make. - Translation from Raidió na Gael broadcast\n    (17th April 1949)";
    			t122 = space();
    			span57 = element("span");
    			span57.textContent = "I would like to bring the Minister’s attention to the very worrying case of\n    two missing children in _ ____. I have been speaking to local people there\n    in recent weeks who say they feel they have been forgotten about. There now\n    appears to be only three fulltime Gardaí working on the case. There has been\n    little to no reassurance from the authorities. It seems to me that the\n    Government has abandoned the people of _____. Will there be any justice? Can\n    the Minister tell me what he is planning to do? - Oral Questions in the Dáil\n    (18th April 1949)";
    			t124 = space();
    			span58 = element("span");
    			span58.textContent = "EXTRACT FROM REPORT BY HEALTH BOARD INTO OUTBREAK OF CERTAIN SYMPTOMS IN\n    ______, JANUARY - MAY 1949: We have compiled a list of people who have\n    reported to their General Practitioner any symptoms that did not have an\n    obvious cause. These symptoms include headaches, vomiting, stomach cramps,\n    tingling, numbness, burning and chest pain. The following list is a sample:\n    • A 45-year-old woman who reported sudden occasions of vomiting and\n    experiencing headaches after using her electric cooker. • A teenage girl who\n    described having stomach cramps, headaches and nausea, which were not\n    alleviated by any pain-relieving medication or anti-inflammatories. • A\n    21-year-old man who had experienced tingling in his extremities and weakness\n    in his upper arms which got better when he was outdoors. • A 52-year-old man\n    who was found outside his home tearing his clothes off because he said that\n    there were wires in them. • A 10-year-old boy who had a high fever and\n    numbness in the extremities. • Two sisters aged 18 and 20 who complained of\n    debilitating pain in their left upper abdomen with no obvious reason for\n    said pain. • A 60-year-old woman who stated that her neighbours were playing\n    tricks on her using electricity. • A woman in her mid-forties who said she\n    was ‘full of electricity’ and who was kept up at night by the sound of men\n    digging in her cellar and laying electric wires.";
    			t126 = space();
    			span59 = element("span");
    			span59.textContent = "Ó Murchú, Paraic suddenly on 23rd of April 1949. Much loved by his wife\n    Rose. Cremation Saturday. No Flowers.";
    			t128 = space();
    			span60 = element("span");
    			span60.textContent = "The three-year-old girl who was declared missing early this morning has\n    been found and returned home to her parents safe and sound. It seems that\n    the child wandered off while shopping with her family and… - Translation\n    from Raidió na Gael broadcast (20th April 1949)";
    			t130 = space();
    			span61 = element("span");
    			span61.textContent = "You would barely recognise the village now we are so suspicious and\n    untrusting. I find myself crossing the road to avoid people. I keep my head\n    down to avoid making eye contact. We do not know our neighbours anymore like\n    we should. I want to be more open, but we all have that lingering doubt in\n    our minds. The Guards are telling us that it is most likely a drifter, an\n    outsider but it could still be one of us. One of us could have kidnapped\n    these children and done… Oh, I can’t bear thinking about it. What would\n    anyone want with those poor boys? Couldn’t they have just left us alone? And\n    the Guards have no leads, no suspects. For a while, we had several Gardaí\n    stationed here. We would see them on their beat and they would give us\n    comfort, but now we see them less and less. They are slowly forgetting us.\n    They want to forget us. This is a crime that will never be solved, and they\n    want rid of it. - Extract from letter dated 18th April 1949, found in the\n    apartment of the late Ms Julia O’Keeffe of New York City";
    			t132 = space();
    			span62 = element("span");
    			span62.textContent = "Electricity is the safest form of power available for both domestic and\n    commercial use. Electricity poles and cables are organised and installed by\n    highly trained workers and the wiring of your house and farm can only be\n    done by a trained electrician. Rest assured, you and your family are safe\n    with electricity in the home. If you still have doubts, please visit our\n    showroom where we will demonstrate various electrical appliances and give\n    advice on what is best for you and your home.";
    			t134 = space();
    			span63 = element("span");
    			span63.textContent = "Two thousand people marched yesterday to bring national attention to what\n    they believe is the mishandling of an investigation by the Gardaí into the\n    disappearance of two infant children in the same area over a six-month\n    period. The protesters are demanding an inquiry into the alleged mishandling\n    of the matter by authorities. - ‘Protesters Demand Answers’, The Irish Times\n    (29th April 1949)";
    			t136 = space();
    			span64 = element("span");
    			span64.textContent = "Electric Water-Heating is peculiarly suitable for use in doctor’s and\n    dentist’s surgeries owing to the ease of economy of installation, the\n    simplicity and cleanliness of operation, and the complete absence of fumes\n    and odours";
    			t138 = space();
    			span65 = element("span");
    			span65.textContent = "Virginia O’Brien, Chairperson of the Irish Countrywomen’s Association, has\n    urged people to continue to support rural electrification. She was speaking\n    at an event last weekend regarding recent protests against the scheme,\n    following links between the introduction of electricity and the\n    disappearances of two young children. People have also been complaining of\n    health issues relating to electricity in their homes. She informed the\n    audience that the Gardaí and local health officials had completely ruled out\n    any such connections and that people who perpetuated these falsehoods were\n    doing damage to the local community. - ‘No link says ICA Chair’ An\n    Iar-Nuacht (30th April 1949)";
    			t140 = space();
    			span66 = element("span");
    			span66.textContent = "INFORMATION LEAFLET FROM THE ESB: A mass hysteria is a collective\n    obsessional behaviour where a group of people spontaneously manifest similar\n    hysterical symptoms.";
    			t142 = space();
    			span67 = element("span");
    			span67.textContent = "IT WILL NEVER STOP THEY WILL CONTINU TO RUIN FAMILYS WE NEED TOO TAKE BACK\n    CONTROL NO-ONE WILL HELP US WE AR ON ARE OWN";
    			t144 = space();
    			span68 = element("span");
    			span68.textContent = "‘I have not been able to sleep through the night since they put in the\n    electrics. It’s doing something to my brain. I feel groggy and tired all\n    day. My wife feels nauseous. She has had weakness in her limbs. She’s so\n    weak some days she can’t get out of bed. The doctor says he can do nothing\n    for her.’";
    			t146 = space();
    			span69 = element("span");
    			span69.textContent = "‘It’s clear that we’re not being told all the facts. Now I know there’s\n    been talk of monsters. I’m an educated man. I don’t believe in monsters. But\n    I can’t help but see a connection between these cables in our houses and the\n    disappearances of our children. There is something. There is something\n    affecting our children. Why aren’t the ESB answering our questions?’";
    			t148 = space();
    			span70 = element("span");
    			span70.textContent = "Transcript of interview with Minister O’Reilly on Radio Éireann, 3rd May\n    1949: Q: … Minister O’Reilly, these crimes have occurred in your own\n    constituency. are An Garda Síochána doing enough? A: Firstly, I want to say\n    that I completely understand the frustrations and the worry people are\n    feeling as regards these cases. I want to assure everyone that the Gardaí\n    are doing the best they can to get these two children back to their parents.\n    I’m a parent myself and… Q: But I mean realistically, and I don’t really\n    want to say this, but realistically what are the chances of the boys being\n    returned to their families safely? A: I’m not going to get into that kind of\n    talk. We need to think of the parents —some of whom will be listening to\n    this. We need to think of them and how we can support them… Q: But Minister,\n    one arrest has been made and that man was subsequently released. No other\n    suspects. This man has now died, and it seems now that the trail has run\n    cold. Will we ever get an answer?";
    			t150 = space();
    			span71 = element("span");
    			span71.textContent = "Gardaí say that further investigations are needed to establish whether a\n    man found in a ditch at the side of the road died from injuries due to a\n    hit-and-run. A post-mortem was carried out on Monday by the State\n    Pathologist, but the results have not yet been released. Gardaí are looking\n    for any witnesses who may have been travelling on the Old Road between the\n    hours of 5:30am and 6:30am on the 23rd of April to come forward. - Radio\n    Éireann (14th July 1949)";
    			t152 = space();
    			span72 = element("span");
    			span72.textContent = "‘I’m a farmer. I can see the benefits of electricity to my life, but I\n    don’t believe it is worth putting my young family at risk. Until we have\n    found out what has happened, all electricity to the village should be\n    switched off.’";
    			t154 = space();
    			span73 = element("span");
    			span73.textContent = "‘The important thing is to remain calm.’";
    			t156 = space();
    			span74 = element("span");
    			span74.textContent = "First the lights went off. This happened suddenly one evening a couple of\n    days after a rowdy meeting in the local hall. No kettles were boiled, and\n    all electrical farming equipment was stopped. Candles and matches and\n    paraffin lamps were passed around. Nobody outside of the village really\n    noticed anything was amiss until the electricity poles and cables started\n    crashing down. Men were sent out to replace or repair the poles, but they\n    would just be torn down once more. The poles were cut down and used for\n    firewood. Ovens and dishwashers were hauled out of houses and dumped in\n    front of the ESB showroom. Door-to-door collections were made to collect\n    lightbulbs… - Duane, ibid.";
    			t158 = space();
    			span75 = element("span");
    			span75.textContent = "Transcript of recording made as part of a local history project: … and\n    things got very scary. The streetlights were smashed. My father ripped the\n    cables from the house and removed the hoover and cooker. My parents didn’t\n    want any hassle.";
    			t160 = space();
    			span76 = element("span");
    			span76.textContent = "… from the nuns in Italy who believed they were cats and the dancing manias\n    of the 12th century to the small village in rural Ireland that refused\n    electricity for fears of ‘monsters in the cables’… - A Brief History of\n    Madness, by Madeleine Heffernan (Tigh Uí Dhrisceoil, 1987)";
    			t162 = space();
    			span77 = element("span");
    			span77.textContent = "‘We had a glimpse of what life could be like. It was fleeting. I tell my\n    grandchildren about it, but they don’t believe it.’";
    			t164 = space();
    			span78 = element("span");
    			span78.textContent = "The washing machine is situated directly adjoining the sink so that the\n    wringing may be carried out without wetting the floor.";
    			t166 = space();
    			span79 = element("span");
    			span79.textContent = "They hold aloft their candles and gas lamps—symbols of their revolt against\n    what they believe is the scourge of electricity. Some have called them\n    Luddites; others have mocked them for their supposedly backwards ways but\n    none of that has stopped them. They have remained steadfast in their belief.\n    They are strong in their principles in a way that very few people are these\n    days and I have to say I respect them for that. - ‘An Irishman’s Diary’ The\n    Irish Times (1st August 1949)";
    			t168 = space();
    			span80 = element("span");
    			span80.textContent = "There were reports of at least two households who refused to stop using\n    electricity. They enjoyed the benefits that came with it and they did not\n    want to return to harder times. Local opinion of them was hostile. The\n    thought that they would be willing to put their children at risk for the\n    sake of convenience was too much for their neighbours. These families were\n    forced out of their homes, and effectively hounded out of the village. -\n    Duane, ibid.";
    			t170 = space();
    			span81 = element("span");
    			span81.textContent = "The electric cooker has been proved to be the cheapest method of preparing\n    meals. It is quick too because of the speed-o-matic plates which are fitted\n    to every new cooker.";
    			t172 = space();
    			span82 = element("span");
    			span82.textContent = "Two men have been arrested on suspicion of setting fire to an ESB showroom\n    just outside of ______. The men were protesting the introduction of\n    electricity in the area. Gardaí are looking for witnesses to the incident. -\n    Radio Éireann (20th July 1949)";
    			t174 = space();
    			span83 = element("span");
    			span83.textContent = "And because he was a man, he tried to fix her: he bought her things, he\n    listened, he yelled at her, he brought her to a doctor. He tried to change\n    himself, tried to make himself into something new. But nothing seemed to\n    work. He could never make her whole again and so he decided that instead he\n    would create a life for them together: he found a cottage by the beach and\n    placed her there. He cooked for her, he held her, he loved her, he married\n    her. He kept others away. He made their lives together as small as they\n    could be. They were each other’s secret. They were cocooned. Then came a\n    brief flickering moment of joy: a baby came, and her belly grew. And she was\n    happy, and he marvelled at how happy she was until the blood came and took\n    the baby away. - Extract from This Gathering Light by Angela Czochara (2006)";
    			t176 = space();
    			span84 = element("span");
    			span84.textContent = "MEMORANDUM FOR: ATTENTION OF THE MINISTER SUBJECT: RURAL ELECTRIFICATION\n    DATE:10th SEPTEMBER 1949";
    			t178 = space();
    			span85 = element("span");
    			span85.textContent = "Across the country parishes lit up. The lives of farmers and rural\n    housewives improved dramatically in a short space of time. No longer did\n    water have to be drawn from a well and carried by cart. No longer was\n    cooking restricted to an open fire. By 1965, 80% of rural households were\n    connected to the electricity supply. - Swanzy, ibid.";
    			t180 = space();
    			span86 = element("span");
    			span86.textContent = "I live with my mammy and daddy, my two sisters, and a dog called Rusty. I\n    have been in this new school for three months and I like it a lot and I have\n    made lots of friends. I do miss my old friends and my old school and the\n    rocky place where we would go and play. But here my room is bright and there\n    aren’t monsters and my mammy and daddy are happy. I liked my old home a lot\n    but then things were scary, and we had to come here. Everything is nice\n    here. - Essay by a child that formed part of an exhibition in the National\n    Museum of Country Life (March – October 2016)";
    			t182 = space();
    			span87 = element("span");
    			span87.textContent = "Local party members advise against the forced introduction of electricity\n    in the village of _____ in County ____. The presence of the army will only\n    exacerbate an already tense situation. A representative from the ESB has\n    also expressed concern for the wellbeing of their employees if they are\n    forced to work in the area. As you know there have been reports of ESB\n    workers being attacked, work gear being stolen, and a display shop being set\n    on fire.";
    			t184 = space();
    			span88 = element("span");
    			span88.textContent = "In loving memory of ____ who has been missing from his home since 14th\n    October 1948. Mammy and Daddy think about you every day.";
    			t186 = space();
    			span89 = element("span");
    			span89.textContent = "Transcript of recording made as part of a local history project: … I would\n    tell Mammy I was going to stay with Máire and she would tell her mam that\n    she was staying with me and then we would go and stay with Davey’s cousin.\n    Davey was someone I knew from the village. His cousin lived in ______ and\n    she had a record player and we listened to jazz records that her sister in\n    America sent her. And we would dance in her living room and her mother made\n    us a roast chicken dinner.";
    			t188 = space();
    			span90 = element("span");
    			span90.textContent = "With the switching on of electricity in the Black Valley, Co. Kerry in June\n    1976, the whole of the island was finally electrified. Except of course for\n    one village which refused to be dragged into the 20th century. It remains\n    the only area in the country without electricity to this day. - Swanzy,\n    ibid.";
    			t190 = space();
    			span91 = element("span");
    			span91.textContent = "The Numbers The Electricity Supply Board was established on 11 August 1927.\n    1 million poles, 100,000 transformers and 75,000 miles of line 300,000 homes\n    connected. By 1946 the number of consumers had reached 240,000 using 380\n    million units per annum.";
    			t192 = space();
    			span92 = element("span");
    			span92.textContent = "For decades the village of ______ has been ridiculed for its refusal to be\n    welcomed into the 20th—not to mention 21st—century. However, the truth is\n    altogether more worrying as the team from Prime Time Investigates uncovered\n    Monday night on RTÉ One. The programme provided a rare insight into a people\n    who have effectively closed themselves off from the outside world. We are\n    first introduced to Mary, a pleasant woman in her late sixties who sees\n    nothing wrong with the hard work involved in washing, cleaning and cooking\n    without electricity. She says she was raised to work hard, and she sees no\n    problem with it. We subsequently join local men at a pub where they sing\n    songs and tell stories and create their own entertainment. They speak in an\n    odd, old-fashioned dialect that marks them out as different. It is a quaint\n    kind of life and one that looks appealingly nostalgic until we meet Neasa.\n    Neasa grew up in the village and was subject to physical abuse at the hands\n    of her family. She escaped when she was 18 and has never returned. For her\n    it is not just about the electricity, she explains, the darkness is a form\n    of control. The village does not allow strangers to stay long and they do\n    not respect the authority of the Gardaí or the State. A place where no light\n    shines will always be ripe for abuse… ‘An Dorchadas/The Darkness’, The Irish\n    Times (15th December 2009)";
    			t194 = space();
    			span93 = element("span");
    			span93.textContent = "It has been now over 30 years since two small boys vanished from their\n    homes in ______. A recently formed community group is staging a rally this\n    lunchtime to commemorate the disappearances. They will lay flowers at the\n    locations the boys were last seen —a bedroom, a front garden, a\n    pavement—before continuing on to the local Garda station. The Gardaí have\n    responded to concerns by launching a renewed appeal for information. The\n    Garda Superintendent in charge of the investigation said that the passage of\n    time might have made some people more willing to come forward with\n    information. He reassured people that they will be treated respectfully and\n    discreetly. Anyone with information is asked to contact the Garda\n    Confidential Line. - ‘30th anniversary of disappearances’ The Irish Examiner\n    (October 1979)";
    			t196 = space();
    			span94 = element("span");
    			span94.textContent = "Proper lighting in the home or workshop is the best guarantee of continued\n    good eyesight for adults and children.";
    			t198 = space();
    			span95 = element("span");
    			span95.textContent = "The expectation in official circles was that over time old superstitions\n    would fade away, the older generation would die off and electricity would be\n    reintroduced without incident. And yet the village remains in complete\n    darkness to this very day. Partly this is to do with geography— it is\n    situated in an isolated rural area—and partly it is due to a lack of\n    financial support from the government. When the local population started to\n    rip out poles and cables, the ESB were sent to restore the light, but their\n    workers were attacked and abused. On the completion of the rural\n    electrification scheme, the government refused further State funding for the\n    area unless the locals agreed to allow electricity back in their homes. They\n    declined and the stalemate has continued ever since. - Duane, ibid.";
    			t200 = space();
    			span96 = element("span");
    			span96.textContent = "The initial amusement and subsequent alarm of some public servants in\n    relation to a village in the West which had turned against the rural\n    electrification scheme has been revealed in the latest batch of state\n    documents released under the 30-year rule. Memos from the Department of\n    Rural Affairs reveal the dismissive attitude of civil servants towards the\n    area. The village had suffered several child abductions which were\n    attributed to the recently installed electricity cables. The villagers\n    become increasingly suspicious resulting in the tearing down of the\n    electricity infrastructure. Their belief was that there were ‘monsters’ in\n    the electricity lines. - ‘State papers: a round-up’ The Irish Examiner (27th\n    December 1978)";
    			t202 = space();
    			span97 = element("span");
    			span97.textContent = "‘I would do my homework in the evening by lamplight. At school we had dry\n    toilets that were only flushed once a day.’";
    			t204 = space();
    			span98 = element("span");
    			span98.textContent = "This is the last ever issue of the REO News and we hope that you have\n    gained some insight and support from what we have published. - Editor’s\n    Letter, REO News (vol. 168, November 1961)";
    			t206 = space();
    			span99 = element("span");
    			span99.textContent = "Looking for a digital detox holiday on a budget? Then take a look at some\n    of these amazing properties in ______ in Ireland. Step back in time to a\n    simpler era. The entire village has no electricity which means you can have\n    the opportunity to switch off completely. Enjoy your dinner by paraffin\n    lamp, practice mindfulness while you wash clothes by hand, learn how to cook\n    your food over an open fire… - Article in The New York Times Travel Section,\n    (7th June 2012)";
    			t208 = space();
    			span100 = element("span");
    			span100.textContent = "Welcome to Fade Away, the podcast about people who have disappeared without\n    trace. In Season 1, we examined the case of Marcy Wainwright, a woman who\n    one day vanished from her factory job. In Season 2, we focused on the\n    Clement family, who haven’t been seen since Christmas Eve 1865. Now in\n    Season 3, we are looking into the alleged abductions of two children in…\n    Intro to Fade Away, August 2014";
    			t210 = space();
    			span101 = element("span");
    			span101.textContent = "TO: info@fadeawaypodcast.com FROM: ------------------------ RE: PODCAST —\n    INFO DATE: 29 Sept 2015, 13:47 -------------------------------------------\n    Hi, My name is I’ve just come across your podcast and I think I might have\n    some information for you. My grandmother grew up in the village and she was\n    there when the abductions took place. She emigrated to Canada in the 60s.\n    She never spoke about what happened but after she died, we found some notes\n    she had written which may be useful to";
    			t212 = space();
    			span102 = element("span");
    			span102.textContent = "Gardaí have confirmed that they are pursuing several new leads of inquiry\n    following renewed interest in the cases arising out of a true-crime podcast\n    which has… - ‘Podcast leads to new avenues of inquiry’, An Iar Nuacht (23rd\n    November 2015)";
    			t214 = space();
    			span103 = element("span");
    			span103.textContent = "‘This third season has been a real breakthrough for us. We got good numbers\n    and interaction for season one and two but this year things have just gotten\n    crazy,’ says Weeverman. And what does she say to critics who accuse the\n    true-crime podcast genre of unethical behaviour and exploitation. ‘It’s\n    something we are both very aware of. That’s part of the reason we chose\n    crimes that were committed at least a generation ago. We don’t want\n    relatives to be upset and having to read… ’ - Extract from interview with\n    Harriet Gose and Francine Weeverman, Flash Magazine (13th April 2015)";
    			t216 = space();
    			span104 = element("span");
    			span104.textContent = "… one of many who say that this is a cover up. The police missed vital\n    clues while neighbours looked the other way. A lot of coincidences. What was\n    really going on? I would recommend everyone to read Satan in Ireland by JM\n    Henry to learn more about satanic groups that were… - Extract from blog\n    entitled ‘The Disappearances 1948 - 49’";
    			t218 = space();
    			section = element("section");
    			h1 = element("h1");
    			h1.textContent = "Discussion thread on Episode 6: What Did the Neighbours Know?";
    			t220 = space();
    			div4 = element("div");
    			div1 = element("div");
    			div1.textContent = "C_A_Dupin";
    			t222 = space();
    			div2 = element("div");
    			div2.textContent = "The problem the cops had was that they believed ‘everyone was at the\n        switching on’ so they never got a proper list of people together. And we\n        all know of course that Mrs Geary didn’t attend because she was feeling\n        unwell and so she went home by herself. And the O’Reillys didn’t attend\n        either—were they going to a wedding the next day or something…";
    			t224 = space();
    			div3 = element("div");
    			button0 = element("button");
    			button0.textContent = "Like";
    			button1 = element("button");
    			button1.textContent = "Dislike";
    			button2 = element("button");
    			button2.textContent = "Comment";
    			button3 = element("button");
    			button3.textContent = "Favourite";
    			t229 = space();
    			div8 = element("div");
    			div5 = element("div");
    			div5.textContent = "M4Murder";
    			t231 = space();
    			div6 = element("div");
    			div6.textContent = "But are we seriously suggesting that any of these people were involved\n        in the kidnapping of the first child? What’s the motive here? The first\n        child to me is the key becuase he was upstairs in his own bed. That’s\n        not a ‘by chance’ kidnapping. That was palnned. The switching on was the\n        opportunity they needed.";
    			t233 = space();
    			div7 = element("div");
    			button4 = element("button");
    			button4.textContent = "Like";
    			button5 = element("button");
    			button5.textContent = "Dislike";
    			button6 = element("button");
    			button6.textContent = "Comment";
    			button7 = element("button");
    			button7.textContent = "Favourite";
    			t238 = space();
    			div12 = element("div");
    			div9 = element("div");
    			div9.textContent = "Hastings";
    			t240 = space();
    			div10 = element("div");
    			div10.textContent = "What about the witness statement from Francis Byrne? She saw footsteps\n        in her garden but the police never took photos or imprints.";
    			t242 = space();
    			div11 = element("div");
    			button8 = element("button");
    			button8.textContent = "Like";
    			button9 = element("button");
    			button9.textContent = "Dislike";
    			button10 = element("button");
    			button10.textContent = "Comment";
    			button11 = element("button");
    			button11.textContent = "Favourite";
    			t247 = space();
    			div16 = element("div");
    			div13 = element("div");
    			div13.textContent = "ChndlerR1";
    			t249 = space();
    			div14 = element("div");
    			div14.textContent = "[comment deleted]";
    			t251 = space();
    			div15 = element("div");
    			button12 = element("button");
    			button12.textContent = "Like";
    			button13 = element("button");
    			button13.textContent = "Dislike";
    			button14 = element("button");
    			button14.textContent = "Comment";
    			button15 = element("button");
    			button15.textContent = "Favourite";
    			t256 = space();
    			div20 = element("div");
    			div17 = element("div");
    			div17.textContent = "C_A_Dupin";
    			t258 = space();
    			div18 = element("div");
    			div18.textContent = "@ChndlerR1 This is a serious thread to discuss matters that arise in the\n        course of the podcast. That’s serious discussion only pertaining to the\n        facts of the case. If you want to speculate wildly there are plenty of\n        other forums for that.";
    			t260 = space();
    			div19 = element("div");
    			button16 = element("button");
    			button16.textContent = "Like";
    			button17 = element("button");
    			button17.textContent = "Dislike";
    			button18 = element("button");
    			button18.textContent = "Comment";
    			button19 = element("button");
    			button19.textContent = "Favourite";
    			t265 = space();
    			div24 = element("div");
    			div21 = element("div");
    			div21.textContent = "M4Murder";
    			t267 = space();
    			div22 = element("div");
    			div22.textContent = "@Hastings Yeah, I thought that was interesting too. Like, FB’s garden\n        backed on to the victims so someone could likely have escaped that way.\n        They didn’t dwell on it on the pod though so maybe they know more than\n        they are letting on abot that right now.";
    			t269 = space();
    			div23 = element("div");
    			button20 = element("button");
    			button20.textContent = "Like";
    			button21 = element("button");
    			button21.textContent = "Dislike";
    			button22 = element("button");
    			button22.textContent = "Comment";
    			button23 = element("button");
    			button23.textContent = "Favourite";
    			t274 = space();
    			div28 = element("div");
    			div25 = element("div");
    			div25.textContent = "TruCrimFan";
    			t276 = space();
    			div26 = element("div");
    			div26.textContent = "Hi! new to the thread. I’m just wondering what people feel about the\n        parents. Am not talking shit I just am genuinely wondering. It’s kind of\n        like occam’s razor.a lot of the neighbors seem to think that the house\n        was a little dysfuntioncal. Maybe they were abusing the kid or they\n        killed him accidentally or something. The other idnappings were a cover\n        up. Again, please don’;t ban me. I really want to know more.";
    			t278 = space();
    			div27 = element("div");
    			button24 = element("button");
    			button24.textContent = "Like";
    			button25 = element("button");
    			button25.textContent = "Dislike";
    			button26 = element("button");
    			button26.textContent = "Comment";
    			button27 = element("button");
    			button27.textContent = "Favourite";
    			t283 = space();
    			div32 = element("div");
    			div29 = element("div");
    			div29.textContent = "C_A_Dupin";
    			t285 = space();
    			div30 = element("div");
    			div30.textContent = "@TruCrimFan There are threads about the parents. Check out the search\n        bar.";
    			t287 = space();
    			div31 = element("div");
    			button28 = element("button");
    			button28.textContent = "Like";
    			button29 = element("button");
    			button29.textContent = "Dislike";
    			button30 = element("button");
    			button30.textContent = "Comment";
    			button31 = element("button");
    			button31.textContent = "Favourite";
    			t292 = space();
    			span105 = element("span");
    			span105.textContent = "Reviewers have often suggested illusions in his music to PJ Harvey, Steely\n    Dan and Captain Beefheart, but all of this was news to the young Sammy\n    Lynch. He had never heard of any of these artists. He grew up in a tiny\n    village in the West of Ireland without electricity and therefore no record\n    players, no radios and no internet. He had grown up with music, of course,\n    but it was all traditional melodies and songs that had been written hundreds\n    of years prior. For his twelfth birthday he asked for a guitar and started\n    immediately to write his own weird little songs. -'Darkness into Light' by\n    Oliver Rapid, PPOPP Magazine (Issue 381)";
    			t294 = space();
    			span106 = element("span");
    			span106.textContent = "… a link in the minds of many people even today between the erection of\n    electricity poles and the disappearance of fairies, banshees, leprechauns.\n    Maybe their homes were indeed disturbed by workers or perhaps this is just a\n    metaphor for… - ‘The Last of the Fairies’ by Sam Beaton Hibernian Monthly\n    (vol 67, 3rd August 1998, p. 22 27)";
    			t296 = space();
    			span107 = element("span");
    			span107.textContent = "The Network Renewal Plan began in the late 1990s to upgrade the electricity\n    supply to reflect the needs of modern Ireland.";
    			t298 = space();
    			span108 = element("span");
    			span108.textContent = "There remains a lot of interest from an anthropological view as well. The\n    village has retained many of the old methods and routines that modernisation\n    has swallowed up in the rest of the country. Old methods of cooking have\n    been preserved and farming practices from a bygone age remain commonplace.\n    Their isolation has preserved the village as if frozen in time. Naw purteen\n    narr honchee - Duane, ibid.";
    			t300 = space();
    			span109 = element("span");
    			span109.textContent = "Tch buteagh y ar maggee Fado al sunee thist giy ar nournagh - Song written\n    in the local dialect";
    			t302 = space();
    			span110 = element("span");
    			span110.textContent = "You Won’t Believe These Places That Have No Electricity - Buzzfeed (March\n    2019)";
    			t304 = space();
    			span111 = element("span");
    			span111.textContent = "The link between ‘screen time’ (short-wavelength, artificial blue light\n    emitted from electronic devices) and sleep disorders has been well\n    established in several studies (Delahunt et al., 2015; Brennan & Jones 2008;\n    Parsons 2016). The comparisons as set out in Graph 1b shows the differences\n    in sleep quality between Group A (control group) and Group B (digital\n    natives) … - Comparative evaluation of the health effects of technology\n    between digital natives and digital naïfs, Goetsmen & Waine (2017)";
    			t306 = space();
    			span112 = element("span");
    			span112.textContent = "On the way out of the village is a memorial to the two children. It is\n    well-kept and is always covered in flowers and teddy bears and mass cards. -\n    Cahalane, ibid.";
    			t308 = space();
    			span113 = element("span");
    			span113.textContent = "Mary Lane (1924 - 2020): Mary Lane worked as the chief archivist for the\n    ESB between 1966 and 1996. She trained initially as a librarian and worked\n    for a time for UCD before joining the ESB as assistant archivist in 1945. On\n    the retirement of her predecessor, she took over the main role.";
    			t310 = space();
    			span114 = element("span");
    			span114.textContent = "John 1:5 And the light shineth in darkness; and the darkness comprehended\n    it not.";
    			t312 = space();
    			div34 = element("div");
    			p2 = element("p");
    			em0 = element("em");
    			em0.textContent = "Getting The Electric";
    			t314 = text(", written by Louise Hegarty, was first\n    published in\n    ");
    			em1 = element("em");
    			a = element("a");
    			a.textContent = "The Stinging Fly";
    			t316 = text(".");
    			t317 = space();
    			p3 = element("p");
    			t318 = text("Louise Hegarty has had work published in ");
    			em2 = element("em");
    			em2.textContent = "Banshee";
    			t320 = text(",\n    ");
    			em3 = element("em");
    			em3.textContent = "The Tangerine";
    			t322 = text(", and\n    ");
    			em4 = element("em");
    			em4.textContent = "The Dublin Review";
    			t324 = text(". Recently, she had a short story featured on BBC\n    Radio 4’s Short Works. She lives in Cork.");
    			attr_dev(span0, "class", "el-sec svelte-1gpeq1m");
    			add_location(span0, file$d, 31, 2, 807);
    			attr_dev(span1, "class", "el-sec g7 justified svelte-1gpeq1m");
    			add_location(span1, file$d, 37, 2, 1122);
    			attr_dev(span2, "class", "r90cc svelte-1gpeq1m");
    			add_location(span2, file$d, 43, 4, 1430);
    			attr_dev(p0, "class", "el-sec g5 r2 svelte-1gpeq1m");
    			add_location(p0, file$d, 42, 2, 1401);
    			if (img.src !== (img_src_value = "/assets/images/gte1.jpg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "gte1");
    			attr_dev(img, "class", "grid-image svelte-1gpeq1m");
    			add_location(img, file$d, 55, 4, 2100);
    			attr_dev(div0, "class", "img-wrapper el-sec g7 svelte-1gpeq1m");
    			add_location(div0, file$d, 54, 2, 2060);
    			attr_dev(span3, "class", "el-sec g7 justified svelte-1gpeq1m");
    			add_location(span3, file$d, 57, 2, 2179);
    			add_location(br0, file$d, 65, 37, 2675);
    			add_location(br1, file$d, 65, 79, 2717);
    			add_location(br2, file$d, 67, 51, 2779);
    			add_location(br3, file$d, 68, 14, 2823);
    			attr_dev(span4, "class", "el-sec g5 centred svelte-1gpeq1m");
    			add_location(span4, file$d, 64, 2, 2606);
    			add_location(strong0, file$d, 71, 5, 2900);
    			add_location(br4, file$d, 77, 5, 3290);
    			attr_dev(span5, "class", "el-sec svelte-1gpeq1m");
    			add_location(span5, file$d, 70, 2, 2874);
    			add_location(strong1, file$d, 82, 7, 3479);
    			add_location(br5, file$d, 82, 54, 3526);
    			attr_dev(span6, "class", "r90cc svelte-1gpeq1m");
    			add_location(span6, file$d, 81, 4, 3452);
    			attr_dev(p1, "class", "el-sec g7 svelte-1gpeq1m");
    			add_location(p1, file$d, 80, 2, 3426);
    			attr_dev(span7, "class", "el-sec svelte-1gpeq1m");
    			add_location(span7, file$d, 92, 2, 4124);
    			attr_dev(span8, "class", "el-sec svelte-1gpeq1m");
    			add_location(span8, file$d, 98, 2, 4417);
    			attr_dev(span9, "class", "el-sec svelte-1gpeq1m");
    			add_location(span9, file$d, 108, 2, 5064);
    			attr_dev(span10, "class", "el-sec svelte-1gpeq1m");
    			add_location(span10, file$d, 117, 2, 5598);
    			attr_dev(span11, "class", "el-sec svelte-1gpeq1m");
    			add_location(span11, file$d, 126, 2, 6124);
    			attr_dev(span12, "class", "el-sec svelte-1gpeq1m");
    			add_location(span12, file$d, 130, 2, 6258);
    			attr_dev(span13, "class", "el-sec svelte-1gpeq1m");
    			add_location(span13, file$d, 137, 2, 6607);
    			attr_dev(span14, "class", "el-sec svelte-1gpeq1m");
    			add_location(span14, file$d, 145, 2, 7036);
    			attr_dev(span15, "class", "el-sec svelte-1gpeq1m");
    			add_location(span15, file$d, 154, 2, 7575);
    			attr_dev(span16, "class", "el-sec svelte-1gpeq1m");
    			add_location(span16, file$d, 158, 2, 7751);
    			attr_dev(span17, "class", "el-sec svelte-1gpeq1m");
    			add_location(span17, file$d, 166, 2, 8208);
    			attr_dev(span18, "class", "el-sec svelte-1gpeq1m");
    			add_location(span18, file$d, 173, 2, 8637);
    			attr_dev(span19, "class", "el-sec svelte-1gpeq1m");
    			add_location(span19, file$d, 178, 2, 8851);
    			attr_dev(span20, "class", "el-sec svelte-1gpeq1m");
    			add_location(span20, file$d, 184, 2, 9162);
    			attr_dev(span21, "class", "el-sec svelte-1gpeq1m");
    			add_location(span21, file$d, 190, 2, 9476);
    			attr_dev(span22, "class", "el-sec svelte-1gpeq1m");
    			add_location(span22, file$d, 198, 2, 9919);
    			attr_dev(span23, "class", "el-sec svelte-1gpeq1m");
    			add_location(span23, file$d, 208, 2, 10541);
    			attr_dev(span24, "class", "el-sec svelte-1gpeq1m");
    			add_location(span24, file$d, 213, 2, 10745);
    			attr_dev(span25, "class", "el-sec svelte-1gpeq1m");
    			add_location(span25, file$d, 233, 2, 12160);
    			attr_dev(span26, "class", "el-sec svelte-1gpeq1m");
    			add_location(span26, file$d, 242, 2, 12710);
    			attr_dev(span27, "class", "el-sec svelte-1gpeq1m");
    			add_location(span27, file$d, 248, 2, 13019);
    			attr_dev(span28, "class", "el-sec svelte-1gpeq1m");
    			add_location(span28, file$d, 255, 2, 13390);
    			attr_dev(span29, "class", "el-sec svelte-1gpeq1m");
    			add_location(span29, file$d, 261, 2, 13724);
    			attr_dev(span30, "class", "el-sec svelte-1gpeq1m");
    			add_location(span30, file$d, 274, 2, 14621);
    			attr_dev(span31, "class", "el-sec svelte-1gpeq1m");
    			add_location(span31, file$d, 284, 2, 15293);
    			attr_dev(span32, "class", "el-sec svelte-1gpeq1m");
    			add_location(span32, file$d, 293, 2, 15817);
    			attr_dev(span33, "class", "el-sec svelte-1gpeq1m");
    			add_location(span33, file$d, 302, 2, 16396);
    			attr_dev(span34, "class", "el-sec svelte-1gpeq1m");
    			add_location(span34, file$d, 308, 2, 16708);
    			attr_dev(span35, "class", "el-sec svelte-1gpeq1m");
    			add_location(span35, file$d, 317, 2, 17218);
    			attr_dev(span36, "class", "el-sec svelte-1gpeq1m");
    			add_location(span36, file$d, 326, 2, 17767);
    			attr_dev(span37, "class", "el-sec svelte-1gpeq1m");
    			add_location(span37, file$d, 329, 2, 17858);
    			attr_dev(span38, "class", "el-sec svelte-1gpeq1m");
    			add_location(span38, file$d, 337, 2, 18333);
    			attr_dev(span39, "class", "el-sec svelte-1gpeq1m");
    			add_location(span39, file$d, 344, 2, 18745);
    			attr_dev(span40, "class", "el-sec svelte-1gpeq1m");
    			add_location(span40, file$d, 353, 2, 19287);
    			attr_dev(span41, "class", "el-sec svelte-1gpeq1m");
    			add_location(span41, file$d, 365, 2, 20031);
    			attr_dev(span42, "class", "el-sec svelte-1gpeq1m");
    			add_location(span42, file$d, 376, 2, 20737);
    			attr_dev(span43, "class", "el-sec svelte-1gpeq1m");
    			add_location(span43, file$d, 383, 2, 21110);
    			attr_dev(span44, "class", "el-sec svelte-1gpeq1m");
    			add_location(span44, file$d, 390, 2, 21481);
    			attr_dev(span45, "class", "el-sec svelte-1gpeq1m");
    			add_location(span45, file$d, 397, 2, 21862);
    			attr_dev(span46, "class", "el-sec svelte-1gpeq1m");
    			add_location(span46, file$d, 403, 2, 22173);
    			attr_dev(span47, "class", "el-sec svelte-1gpeq1m");
    			add_location(span47, file$d, 409, 2, 22503);
    			attr_dev(span48, "class", "el-sec svelte-1gpeq1m");
    			add_location(span48, file$d, 417, 2, 22949);
    			attr_dev(span49, "class", "el-sec svelte-1gpeq1m");
    			add_location(span49, file$d, 424, 2, 23358);
    			attr_dev(span50, "class", "el-sec svelte-1gpeq1m");
    			add_location(span50, file$d, 428, 2, 23515);
    			attr_dev(span51, "class", "el-sec svelte-1gpeq1m");
    			add_location(span51, file$d, 437, 2, 24052);
    			attr_dev(span52, "class", "el-sec svelte-1gpeq1m");
    			add_location(span52, file$d, 441, 2, 24219);
    			attr_dev(span53, "class", "el-sec svelte-1gpeq1m");
    			add_location(span53, file$d, 453, 2, 25033);
    			attr_dev(span54, "class", "el-sec svelte-1gpeq1m");
    			add_location(span54, file$d, 459, 2, 25354);
    			attr_dev(span55, "class", "el-sec svelte-1gpeq1m");
    			add_location(span55, file$d, 467, 2, 25845);
    			attr_dev(span56, "class", "el-sec svelte-1gpeq1m");
    			add_location(span56, file$d, 473, 2, 26135);
    			attr_dev(span57, "class", "el-sec svelte-1gpeq1m");
    			add_location(span57, file$d, 482, 2, 26656);
    			attr_dev(span58, "class", "el-sec svelte-1gpeq1m");
    			add_location(span58, file$d, 492, 2, 27269);
    			attr_dev(span59, "class", "el-sec svelte-1gpeq1m");
    			add_location(span59, file$d, 513, 2, 28760);
    			attr_dev(span60, "class", "el-sec svelte-1gpeq1m");
    			add_location(span60, file$d, 517, 2, 28912);
    			attr_dev(span61, "class", "el-sec svelte-1gpeq1m");
    			add_location(span61, file$d, 523, 2, 29229);
    			attr_dev(span62, "class", "el-sec svelte-1gpeq1m");
    			add_location(span62, file$d, 539, 2, 30338);
    			attr_dev(span63, "class", "el-sec svelte-1gpeq1m");
    			add_location(span63, file$d, 548, 2, 30888);
    			attr_dev(span64, "class", "el-sec svelte-1gpeq1m");
    			add_location(span64, file$d, 556, 2, 31338);
    			attr_dev(span65, "class", "el-sec svelte-1gpeq1m");
    			add_location(span65, file$d, 562, 2, 31614);
    			attr_dev(span66, "class", "el-sec svelte-1gpeq1m");
    			add_location(span66, file$d, 574, 2, 32368);
    			attr_dev(span67, "class", "el-sec svelte-1gpeq1m");
    			add_location(span67, file$d, 579, 2, 32578);
    			attr_dev(span68, "class", "el-sec svelte-1gpeq1m");
    			add_location(span68, file$d, 583, 2, 32740);
    			attr_dev(span69, "class", "el-sec svelte-1gpeq1m");
    			add_location(span69, file$d, 590, 2, 33096);
    			attr_dev(span70, "class", "el-sec svelte-1gpeq1m");
    			add_location(span70, file$d, 597, 2, 33516);
    			attr_dev(span71, "class", "el-sec svelte-1gpeq1m");
    			add_location(span71, file$d, 613, 2, 34602);
    			attr_dev(span72, "class", "el-sec svelte-1gpeq1m");
    			add_location(span72, file$d, 622, 2, 35125);
    			attr_dev(span73, "class", "el-sec svelte-1gpeq1m");
    			add_location(span73, file$d, 627, 4, 35402);
    			attr_dev(span74, "class", "el-sec svelte-1gpeq1m");
    			add_location(span74, file$d, 628, 2, 35474);
    			attr_dev(span75, "class", "el-sec svelte-1gpeq1m");
    			add_location(span75, file$d, 640, 2, 36230);
    			attr_dev(span76, "class", "el-sec svelte-1gpeq1m");
    			add_location(span76, file$d, 646, 2, 36518);
    			attr_dev(span77, "class", "el-sec svelte-1gpeq1m");
    			add_location(span77, file$d, 652, 2, 36846);
    			attr_dev(span78, "class", "el-sec svelte-1gpeq1m");
    			add_location(span78, file$d, 656, 2, 37013);
    			attr_dev(span79, "class", "el-sec svelte-1gpeq1m");
    			add_location(span79, file$d, 660, 2, 37182);
    			attr_dev(span80, "class", "el-sec svelte-1gpeq1m");
    			add_location(span80, file$d, 669, 2, 37724);
    			attr_dev(span81, "class", "el-sec svelte-1gpeq1m");
    			add_location(span81, file$d, 678, 2, 38237);
    			attr_dev(span82, "class", "el-sec svelte-1gpeq1m");
    			add_location(span82, file$d, 683, 2, 38455);
    			attr_dev(span83, "class", "el-sec svelte-1gpeq1m");
    			add_location(span83, file$d, 689, 2, 38756);
    			attr_dev(span84, "class", "el-sec svelte-1gpeq1m");
    			add_location(span84, file$d, 702, 2, 39654);
    			attr_dev(span85, "class", "el-sec svelte-1gpeq1m");
    			add_location(span85, file$d, 706, 2, 39794);
    			attr_dev(span86, "class", "el-sec svelte-1gpeq1m");
    			add_location(span86, file$d, 713, 2, 40185);
    			attr_dev(span87, "class", "el-sec svelte-1gpeq1m");
    			add_location(span87, file$d, 723, 2, 40821);
    			attr_dev(span88, "class", "el-sec svelte-1gpeq1m");
    			add_location(span88, file$d, 732, 2, 41334);
    			attr_dev(span89, "class", "el-sec svelte-1gpeq1m");
    			add_location(span89, file$d, 736, 2, 41504);
    			attr_dev(span90, "class", "el-sec svelte-1gpeq1m");
    			add_location(span90, file$d, 745, 2, 42042);
    			attr_dev(span91, "class", "el-sec svelte-1gpeq1m");
    			add_location(span91, file$d, 752, 2, 42400);
    			attr_dev(span92, "class", "el-sec svelte-1gpeq1m");
    			add_location(span92, file$d, 758, 2, 42701);
    			attr_dev(span93, "class", "el-sec svelte-1gpeq1m");
    			add_location(span93, file$d, 779, 2, 44190);
    			attr_dev(span94, "class", "el-sec svelte-1gpeq1m");
    			add_location(span94, file$d, 793, 2, 45081);
    			attr_dev(span95, "class", "el-sec svelte-1gpeq1m");
    			add_location(span95, file$d, 797, 2, 45237);
    			attr_dev(span96, "class", "el-sec svelte-1gpeq1m");
    			add_location(span96, file$d, 810, 2, 46114);
    			attr_dev(span97, "class", "el-sec svelte-1gpeq1m");
    			add_location(span97, file$d, 823, 2, 46921);
    			attr_dev(span98, "class", "el-sec svelte-1gpeq1m");
    			add_location(span98, file$d, 827, 2, 47081);
    			attr_dev(span99, "class", "el-sec svelte-1gpeq1m");
    			add_location(span99, file$d, 832, 2, 47312);
    			attr_dev(span100, "class", "el-sec svelte-1gpeq1m");
    			add_location(span100, file$d, 841, 2, 47839);
    			attr_dev(span101, "class", "el-sec svelte-1gpeq1m");
    			add_location(span101, file$d, 849, 2, 48293);
    			attr_dev(span102, "class", "el-sec svelte-1gpeq1m");
    			add_location(span102, file$d, 858, 2, 48844);
    			attr_dev(span103, "class", "el-sec svelte-1gpeq1m");
    			add_location(span103, file$d, 864, 2, 49135);
    			attr_dev(span104, "class", "el-sec svelte-1gpeq1m");
    			add_location(span104, file$d, 874, 2, 49782);
    			attr_dev(h1, "class", "forum-heading");
    			add_location(h1, file$d, 882, 4, 50206);
    			attr_dev(div1, "class", "post-author svelte-1gpeq1m");
    			add_location(div1, file$d, 886, 6, 50340);
    			attr_dev(div2, "class", "post-body svelte-1gpeq1m");
    			add_location(div2, file$d, 887, 6, 50387);
    			attr_dev(button0, "class", "svelte-1gpeq1m");
    			add_location(button0, file$d, 895, 8, 50854);
    			attr_dev(button1, "class", "svelte-1gpeq1m");
    			add_location(button1, file$d, 895, 29, 50875);
    			attr_dev(button2, "class", "svelte-1gpeq1m");
    			add_location(button2, file$d, 895, 53, 50899);
    			attr_dev(button3, "class", "svelte-1gpeq1m");
    			add_location(button3, file$d, 896, 9, 50932);
    			attr_dev(div3, "class", "post-buttons svelte-1gpeq1m");
    			add_location(div3, file$d, 894, 6, 50819);
    			attr_dev(div4, "class", "post svelte-1gpeq1m");
    			add_location(div4, file$d, 885, 4, 50315);
    			attr_dev(div5, "class", "post-author svelte-1gpeq1m");
    			add_location(div5, file$d, 900, 6, 51012);
    			attr_dev(div6, "class", "post-body svelte-1gpeq1m");
    			add_location(div6, file$d, 901, 6, 51058);
    			attr_dev(button4, "class", "svelte-1gpeq1m");
    			add_location(button4, file$d, 909, 8, 51487);
    			attr_dev(button5, "class", "svelte-1gpeq1m");
    			add_location(button5, file$d, 909, 29, 51508);
    			attr_dev(button6, "class", "svelte-1gpeq1m");
    			add_location(button6, file$d, 909, 53, 51532);
    			attr_dev(button7, "class", "svelte-1gpeq1m");
    			add_location(button7, file$d, 910, 9, 51565);
    			attr_dev(div7, "class", "post-buttons svelte-1gpeq1m");
    			add_location(div7, file$d, 908, 6, 51452);
    			attr_dev(div8, "class", "post svelte-1gpeq1m");
    			add_location(div8, file$d, 899, 4, 50987);
    			attr_dev(div9, "class", "post-author svelte-1gpeq1m");
    			add_location(div9, file$d, 914, 6, 51645);
    			attr_dev(div10, "class", "post-body svelte-1gpeq1m");
    			add_location(div10, file$d, 915, 6, 51691);
    			attr_dev(button8, "class", "svelte-1gpeq1m");
    			add_location(button8, file$d, 920, 8, 51916);
    			attr_dev(button9, "class", "svelte-1gpeq1m");
    			add_location(button9, file$d, 920, 29, 51937);
    			attr_dev(button10, "class", "svelte-1gpeq1m");
    			add_location(button10, file$d, 920, 53, 51961);
    			attr_dev(button11, "class", "svelte-1gpeq1m");
    			add_location(button11, file$d, 921, 9, 51994);
    			attr_dev(div11, "class", "post-buttons svelte-1gpeq1m");
    			add_location(div11, file$d, 919, 6, 51881);
    			attr_dev(div12, "class", "post svelte-1gpeq1m");
    			add_location(div12, file$d, 913, 4, 51620);
    			attr_dev(div13, "class", "post-author svelte-1gpeq1m");
    			add_location(div13, file$d, 925, 6, 52074);
    			attr_dev(div14, "class", "post-body red svelte-1gpeq1m");
    			add_location(div14, file$d, 926, 6, 52121);
    			attr_dev(button12, "class", "svelte-1gpeq1m");
    			add_location(button12, file$d, 928, 8, 52213);
    			attr_dev(button13, "class", "svelte-1gpeq1m");
    			add_location(button13, file$d, 928, 29, 52234);
    			attr_dev(button14, "class", "svelte-1gpeq1m");
    			add_location(button14, file$d, 928, 53, 52258);
    			attr_dev(button15, "class", "svelte-1gpeq1m");
    			add_location(button15, file$d, 929, 9, 52291);
    			attr_dev(div15, "class", "post-buttons svelte-1gpeq1m");
    			add_location(div15, file$d, 927, 6, 52178);
    			attr_dev(div16, "class", "post svelte-1gpeq1m");
    			add_location(div16, file$d, 924, 4, 52049);
    			attr_dev(div17, "class", "post-author svelte-1gpeq1m");
    			add_location(div17, file$d, 933, 6, 52371);
    			attr_dev(div18, "class", "post-body svelte-1gpeq1m");
    			add_location(div18, file$d, 934, 6, 52418);
    			attr_dev(button16, "class", "svelte-1gpeq1m");
    			add_location(button16, file$d, 941, 8, 52767);
    			attr_dev(button17, "class", "svelte-1gpeq1m");
    			add_location(button17, file$d, 941, 29, 52788);
    			attr_dev(button18, "class", "svelte-1gpeq1m");
    			add_location(button18, file$d, 941, 53, 52812);
    			attr_dev(button19, "class", "svelte-1gpeq1m");
    			add_location(button19, file$d, 942, 9, 52845);
    			attr_dev(div19, "class", "post-buttons svelte-1gpeq1m");
    			add_location(div19, file$d, 940, 6, 52732);
    			attr_dev(div20, "class", "post svelte-1gpeq1m");
    			add_location(div20, file$d, 932, 4, 52346);
    			attr_dev(div21, "class", "post-author svelte-1gpeq1m");
    			add_location(div21, file$d, 946, 6, 52925);
    			attr_dev(div22, "class", "post-body svelte-1gpeq1m");
    			add_location(div22, file$d, 947, 6, 52971);
    			attr_dev(button20, "class", "svelte-1gpeq1m");
    			add_location(button20, file$d, 954, 8, 53335);
    			attr_dev(button21, "class", "svelte-1gpeq1m");
    			add_location(button21, file$d, 954, 29, 53356);
    			attr_dev(button22, "class", "svelte-1gpeq1m");
    			add_location(button22, file$d, 954, 53, 53380);
    			attr_dev(button23, "class", "svelte-1gpeq1m");
    			add_location(button23, file$d, 955, 9, 53413);
    			attr_dev(div23, "class", "post-buttons svelte-1gpeq1m");
    			add_location(div23, file$d, 953, 6, 53300);
    			attr_dev(div24, "class", "post svelte-1gpeq1m");
    			add_location(div24, file$d, 945, 4, 52900);
    			attr_dev(div25, "class", "post-author svelte-1gpeq1m");
    			add_location(div25, file$d, 959, 6, 53493);
    			attr_dev(div26, "class", "post-body svelte-1gpeq1m");
    			add_location(div26, file$d, 960, 6, 53541);
    			attr_dev(button24, "class", "svelte-1gpeq1m");
    			add_location(button24, file$d, 969, 8, 54081);
    			attr_dev(button25, "class", "svelte-1gpeq1m");
    			add_location(button25, file$d, 969, 29, 54102);
    			attr_dev(button26, "class", "svelte-1gpeq1m");
    			add_location(button26, file$d, 969, 53, 54126);
    			attr_dev(button27, "class", "svelte-1gpeq1m");
    			add_location(button27, file$d, 970, 9, 54159);
    			attr_dev(div27, "class", "post-buttons svelte-1gpeq1m");
    			add_location(div27, file$d, 968, 6, 54046);
    			attr_dev(div28, "class", "post svelte-1gpeq1m");
    			add_location(div28, file$d, 958, 4, 53468);
    			attr_dev(div29, "class", "post-author svelte-1gpeq1m");
    			add_location(div29, file$d, 974, 6, 54239);
    			attr_dev(div30, "class", "post-body svelte-1gpeq1m");
    			add_location(div30, file$d, 975, 6, 54286);
    			attr_dev(button28, "class", "svelte-1gpeq1m");
    			add_location(button28, file$d, 980, 8, 54455);
    			attr_dev(button29, "class", "svelte-1gpeq1m");
    			add_location(button29, file$d, 980, 29, 54476);
    			attr_dev(button30, "class", "svelte-1gpeq1m");
    			add_location(button30, file$d, 980, 53, 54500);
    			attr_dev(button31, "class", "svelte-1gpeq1m");
    			add_location(button31, file$d, 981, 9, 54533);
    			attr_dev(div31, "class", "post-buttons svelte-1gpeq1m");
    			add_location(div31, file$d, 979, 6, 54420);
    			attr_dev(div32, "class", "post svelte-1gpeq1m");
    			add_location(div32, file$d, 973, 4, 54214);
    			attr_dev(section, "class", "el-sec forum svelte-1gpeq1m");
    			add_location(section, file$d, 881, 2, 50171);
    			attr_dev(span105, "class", "el-sec svelte-1gpeq1m");
    			add_location(span105, file$d, 985, 2, 54599);
    			attr_dev(span106, "class", "el-sec svelte-1gpeq1m");
    			add_location(span106, file$d, 996, 2, 55305);
    			attr_dev(span107, "class", "el-sec svelte-1gpeq1m");
    			add_location(span107, file$d, 1003, 2, 55693);
    			attr_dev(span108, "class", "el-sec svelte-1gpeq1m");
    			add_location(span108, file$d, 1007, 2, 55858);
    			attr_dev(span109, "class", "el-sec svelte-1gpeq1m");
    			add_location(span109, file$d, 1015, 2, 56319);
    			attr_dev(span110, "class", "el-sec svelte-1gpeq1m");
    			add_location(span110, file$d, 1019, 2, 56457);
    			attr_dev(span111, "class", "el-sec svelte-1gpeq1m");
    			add_location(span111, file$d, 1023, 2, 56579);
    			attr_dev(span112, "class", "el-sec svelte-1gpeq1m");
    			add_location(span112, file$d, 1032, 2, 57142);
    			attr_dev(span113, "class", "el-sec svelte-1gpeq1m");
    			add_location(span113, file$d, 1037, 2, 57352);
    			attr_dev(span114, "class", "el-sec svelte-1gpeq1m");
    			add_location(span114, file$d, 1043, 2, 57691);
    			attr_dev(div33, "class", "text electric-text svelte-1gpeq1m");
    			add_location(div33, file$d, 26, 0, 630);
    			add_location(em0, file$d, 1051, 4, 57858);
    			attr_dev(a, "href", "http://stingingfly.org");
    			add_location(a, file$d, 1053, 8, 57951);
    			add_location(em1, file$d, 1053, 4, 57947);
    			add_location(p2, file$d, 1050, 2, 57850);
    			add_location(em2, file$d, 1056, 45, 58069);
    			add_location(em3, file$d, 1057, 4, 58091);
    			add_location(em4, file$d, 1058, 4, 58123);
    			add_location(p3, file$d, 1055, 2, 58020);
    			attr_dev(div34, "class", "credits text");
    			add_location(div34, file$d, 1049, 0, 57821);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(articleheader, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(audioplayer, target, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div33, anchor);
    			append_dev(div33, span0);
    			append_dev(div33, t3);
    			append_dev(div33, span1);
    			append_dev(div33, t5);
    			append_dev(div33, p0);
    			append_dev(p0, span2);
    			append_dev(div33, t7);
    			append_dev(div33, div0);
    			append_dev(div0, img);
    			append_dev(div33, t8);
    			append_dev(div33, span3);
    			append_dev(div33, t10);
    			append_dev(div33, span4);
    			append_dev(span4, t11);
    			append_dev(span4, br0);
    			append_dev(span4, t12);
    			append_dev(span4, br1);
    			append_dev(span4, t13);
    			append_dev(span4, br2);
    			append_dev(span4, t14);
    			append_dev(span4, br3);
    			append_dev(span4, t15);
    			append_dev(div33, t16);
    			append_dev(div33, span5);
    			append_dev(span5, strong0);
    			append_dev(span5, br4);
    			append_dev(span5, t18);
    			append_dev(div33, t19);
    			append_dev(div33, p1);
    			append_dev(p1, span6);
    			append_dev(span6, strong1);
    			append_dev(span6, br5);
    			append_dev(span6, t21);
    			append_dev(div33, t22);
    			append_dev(div33, span7);
    			append_dev(div33, t24);
    			append_dev(div33, span8);
    			append_dev(div33, t26);
    			append_dev(div33, span9);
    			append_dev(div33, t28);
    			append_dev(div33, span10);
    			append_dev(div33, t30);
    			append_dev(div33, span11);
    			append_dev(div33, t32);
    			append_dev(div33, span12);
    			append_dev(div33, t34);
    			append_dev(div33, span13);
    			append_dev(div33, t36);
    			append_dev(div33, span14);
    			append_dev(div33, t38);
    			append_dev(div33, span15);
    			append_dev(div33, t40);
    			append_dev(div33, span16);
    			append_dev(div33, t42);
    			append_dev(div33, span17);
    			append_dev(div33, t44);
    			append_dev(div33, span18);
    			append_dev(div33, t46);
    			append_dev(div33, span19);
    			append_dev(div33, t48);
    			append_dev(div33, span20);
    			append_dev(div33, t50);
    			append_dev(div33, span21);
    			append_dev(div33, t52);
    			append_dev(div33, span22);
    			append_dev(div33, t54);
    			append_dev(div33, span23);
    			append_dev(div33, t56);
    			append_dev(div33, span24);
    			append_dev(div33, t58);
    			append_dev(div33, span25);
    			append_dev(div33, t60);
    			append_dev(div33, span26);
    			append_dev(div33, t62);
    			append_dev(div33, span27);
    			append_dev(div33, t64);
    			append_dev(div33, span28);
    			append_dev(div33, t66);
    			append_dev(div33, span29);
    			append_dev(div33, t68);
    			append_dev(div33, span30);
    			append_dev(div33, t70);
    			append_dev(div33, span31);
    			append_dev(div33, t72);
    			append_dev(div33, span32);
    			append_dev(div33, t74);
    			append_dev(div33, span33);
    			append_dev(div33, t76);
    			append_dev(div33, span34);
    			append_dev(div33, t78);
    			append_dev(div33, span35);
    			append_dev(div33, t80);
    			append_dev(div33, span36);
    			append_dev(div33, t82);
    			append_dev(div33, span37);
    			append_dev(div33, t84);
    			append_dev(div33, span38);
    			append_dev(div33, t86);
    			append_dev(div33, span39);
    			append_dev(div33, t88);
    			append_dev(div33, span40);
    			append_dev(div33, t90);
    			append_dev(div33, span41);
    			append_dev(div33, t92);
    			append_dev(div33, span42);
    			append_dev(div33, t94);
    			append_dev(div33, span43);
    			append_dev(div33, t96);
    			append_dev(div33, span44);
    			append_dev(div33, t98);
    			append_dev(div33, span45);
    			append_dev(div33, t100);
    			append_dev(div33, span46);
    			append_dev(div33, t102);
    			append_dev(div33, span47);
    			append_dev(div33, t104);
    			append_dev(div33, span48);
    			append_dev(div33, t106);
    			append_dev(div33, span49);
    			append_dev(div33, t108);
    			append_dev(div33, span50);
    			append_dev(div33, t110);
    			append_dev(div33, span51);
    			append_dev(div33, t112);
    			append_dev(div33, span52);
    			append_dev(div33, t114);
    			append_dev(div33, span53);
    			append_dev(div33, t116);
    			append_dev(div33, span54);
    			append_dev(div33, t118);
    			append_dev(div33, span55);
    			append_dev(div33, t120);
    			append_dev(div33, span56);
    			append_dev(div33, t122);
    			append_dev(div33, span57);
    			append_dev(div33, t124);
    			append_dev(div33, span58);
    			append_dev(div33, t126);
    			append_dev(div33, span59);
    			append_dev(div33, t128);
    			append_dev(div33, span60);
    			append_dev(div33, t130);
    			append_dev(div33, span61);
    			append_dev(div33, t132);
    			append_dev(div33, span62);
    			append_dev(div33, t134);
    			append_dev(div33, span63);
    			append_dev(div33, t136);
    			append_dev(div33, span64);
    			append_dev(div33, t138);
    			append_dev(div33, span65);
    			append_dev(div33, t140);
    			append_dev(div33, span66);
    			append_dev(div33, t142);
    			append_dev(div33, span67);
    			append_dev(div33, t144);
    			append_dev(div33, span68);
    			append_dev(div33, t146);
    			append_dev(div33, span69);
    			append_dev(div33, t148);
    			append_dev(div33, span70);
    			append_dev(div33, t150);
    			append_dev(div33, span71);
    			append_dev(div33, t152);
    			append_dev(div33, span72);
    			append_dev(div33, t154);
    			append_dev(div33, span73);
    			append_dev(div33, t156);
    			append_dev(div33, span74);
    			append_dev(div33, t158);
    			append_dev(div33, span75);
    			append_dev(div33, t160);
    			append_dev(div33, span76);
    			append_dev(div33, t162);
    			append_dev(div33, span77);
    			append_dev(div33, t164);
    			append_dev(div33, span78);
    			append_dev(div33, t166);
    			append_dev(div33, span79);
    			append_dev(div33, t168);
    			append_dev(div33, span80);
    			append_dev(div33, t170);
    			append_dev(div33, span81);
    			append_dev(div33, t172);
    			append_dev(div33, span82);
    			append_dev(div33, t174);
    			append_dev(div33, span83);
    			append_dev(div33, t176);
    			append_dev(div33, span84);
    			append_dev(div33, t178);
    			append_dev(div33, span85);
    			append_dev(div33, t180);
    			append_dev(div33, span86);
    			append_dev(div33, t182);
    			append_dev(div33, span87);
    			append_dev(div33, t184);
    			append_dev(div33, span88);
    			append_dev(div33, t186);
    			append_dev(div33, span89);
    			append_dev(div33, t188);
    			append_dev(div33, span90);
    			append_dev(div33, t190);
    			append_dev(div33, span91);
    			append_dev(div33, t192);
    			append_dev(div33, span92);
    			append_dev(div33, t194);
    			append_dev(div33, span93);
    			append_dev(div33, t196);
    			append_dev(div33, span94);
    			append_dev(div33, t198);
    			append_dev(div33, span95);
    			append_dev(div33, t200);
    			append_dev(div33, span96);
    			append_dev(div33, t202);
    			append_dev(div33, span97);
    			append_dev(div33, t204);
    			append_dev(div33, span98);
    			append_dev(div33, t206);
    			append_dev(div33, span99);
    			append_dev(div33, t208);
    			append_dev(div33, span100);
    			append_dev(div33, t210);
    			append_dev(div33, span101);
    			append_dev(div33, t212);
    			append_dev(div33, span102);
    			append_dev(div33, t214);
    			append_dev(div33, span103);
    			append_dev(div33, t216);
    			append_dev(div33, span104);
    			append_dev(div33, t218);
    			append_dev(div33, section);
    			append_dev(section, h1);
    			append_dev(section, t220);
    			append_dev(section, div4);
    			append_dev(div4, div1);
    			append_dev(div4, t222);
    			append_dev(div4, div2);
    			append_dev(div4, t224);
    			append_dev(div4, div3);
    			append_dev(div3, button0);
    			append_dev(div3, button1);
    			append_dev(div3, button2);
    			append_dev(div3, button3);
    			append_dev(section, t229);
    			append_dev(section, div8);
    			append_dev(div8, div5);
    			append_dev(div8, t231);
    			append_dev(div8, div6);
    			append_dev(div8, t233);
    			append_dev(div8, div7);
    			append_dev(div7, button4);
    			append_dev(div7, button5);
    			append_dev(div7, button6);
    			append_dev(div7, button7);
    			append_dev(section, t238);
    			append_dev(section, div12);
    			append_dev(div12, div9);
    			append_dev(div12, t240);
    			append_dev(div12, div10);
    			append_dev(div12, t242);
    			append_dev(div12, div11);
    			append_dev(div11, button8);
    			append_dev(div11, button9);
    			append_dev(div11, button10);
    			append_dev(div11, button11);
    			append_dev(section, t247);
    			append_dev(section, div16);
    			append_dev(div16, div13);
    			append_dev(div16, t249);
    			append_dev(div16, div14);
    			append_dev(div16, t251);
    			append_dev(div16, div15);
    			append_dev(div15, button12);
    			append_dev(div15, button13);
    			append_dev(div15, button14);
    			append_dev(div15, button15);
    			append_dev(section, t256);
    			append_dev(section, div20);
    			append_dev(div20, div17);
    			append_dev(div20, t258);
    			append_dev(div20, div18);
    			append_dev(div20, t260);
    			append_dev(div20, div19);
    			append_dev(div19, button16);
    			append_dev(div19, button17);
    			append_dev(div19, button18);
    			append_dev(div19, button19);
    			append_dev(section, t265);
    			append_dev(section, div24);
    			append_dev(div24, div21);
    			append_dev(div24, t267);
    			append_dev(div24, div22);
    			append_dev(div24, t269);
    			append_dev(div24, div23);
    			append_dev(div23, button20);
    			append_dev(div23, button21);
    			append_dev(div23, button22);
    			append_dev(div23, button23);
    			append_dev(section, t274);
    			append_dev(section, div28);
    			append_dev(div28, div25);
    			append_dev(div28, t276);
    			append_dev(div28, div26);
    			append_dev(div28, t278);
    			append_dev(div28, div27);
    			append_dev(div27, button24);
    			append_dev(div27, button25);
    			append_dev(div27, button26);
    			append_dev(div27, button27);
    			append_dev(section, t283);
    			append_dev(section, div32);
    			append_dev(div32, div29);
    			append_dev(div32, t285);
    			append_dev(div32, div30);
    			append_dev(div32, t287);
    			append_dev(div32, div31);
    			append_dev(div31, button28);
    			append_dev(div31, button29);
    			append_dev(div31, button30);
    			append_dev(div31, button31);
    			append_dev(div33, t292);
    			append_dev(div33, span105);
    			append_dev(div33, t294);
    			append_dev(div33, span106);
    			append_dev(div33, t296);
    			append_dev(div33, span107);
    			append_dev(div33, t298);
    			append_dev(div33, span108);
    			append_dev(div33, t300);
    			append_dev(div33, span109);
    			append_dev(div33, t302);
    			append_dev(div33, span110);
    			append_dev(div33, t304);
    			append_dev(div33, span111);
    			append_dev(div33, t306);
    			append_dev(div33, span112);
    			append_dev(div33, t308);
    			append_dev(div33, span113);
    			append_dev(div33, t310);
    			append_dev(div33, span114);
    			insert_dev(target, t312, anchor);
    			insert_dev(target, div34, anchor);
    			append_dev(div34, p2);
    			append_dev(p2, em0);
    			append_dev(p2, t314);
    			append_dev(p2, em1);
    			append_dev(em1, a);
    			append_dev(p2, t316);
    			append_dev(div34, t317);
    			append_dev(div34, p3);
    			append_dev(p3, t318);
    			append_dev(p3, em2);
    			append_dev(p3, t320);
    			append_dev(p3, em3);
    			append_dev(p3, t322);
    			append_dev(p3, em4);
    			append_dev(p3, t324);
    			current = true;
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			const articleheader_changes = {};

    			if (!updating_audioActive && dirty & /*audioActive*/ 1) {
    				updating_audioActive = true;
    				articleheader_changes.audioActive = /*audioActive*/ ctx[0];
    				add_flush_callback(() => updating_audioActive = false);
    			}

    			articleheader.$set(articleheader_changes);
    			const audioplayer_changes = {};
    			if (dirty & /*audioActive*/ 1) audioplayer_changes.active = /*audioActive*/ ctx[0];
    			audioplayer.$set(audioplayer_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(articleheader.$$.fragment, local);
    			transition_in(audioplayer.$$.fragment, local);

    			add_render_callback(() => {
    				if (div33_outro) div33_outro.end(1);

    				if (!div33_intro) div33_intro = create_in_transition(div33, blur, {
    					delay: 100,
    					duration: 800,
    					amount: 10,
    					easing: identity
    				});

    				div33_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(articleheader.$$.fragment, local);
    			transition_out(audioplayer.$$.fragment, local);
    			if (div33_intro) div33_intro.invalidate();

    			div33_outro = create_out_transition(div33, blur, {
    				delay: 0,
    				duration: 600,
    				amount: 10,
    				easing: identity
    			});

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(articleheader, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(audioplayer, detaching);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div33);
    			if (detaching && div33_outro) div33_outro.end();
    			if (detaching) detach_dev(t312);
    			if (detaching) detach_dev(div34);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Electric", slots, []);

    	onMount(() => {
    		document.title = "View Source | 'Getting The Electric' – Louise Hegarty";
    	});

    	let audioActive = false;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Electric> was created with unknown prop '${key}'`);
    	});

    	function articleheader_audioActive_binding(value) {
    		audioActive = value;
    		$$invalidate(0, audioActive);
    	}

    	$$self.$capture_state = () => ({
    		blur,
    		linear: identity,
    		AudioPlayer,
    		ArticleHeader,
    		onMount,
    		audioActive
    	});

    	$$self.$inject_state = $$props => {
    		if ("audioActive" in $$props) $$invalidate(0, audioActive = $$props.audioActive);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [audioActive, articleheader_audioActive_binding];
    }

    class Electric extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Electric",
    			options,
    			id: create_fragment$f.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.32.3 */
    const file$e = "src/App.svelte";

    // (43:6) <Link to="/info">
    function create_default_slot_9(ctx) {
    	let em;

    	const block = {
    		c: function create() {
    			em = element("em");
    			em.textContent = "About";
    			add_location(em, file$e, 42, 23, 1496);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, em, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(em);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_9.name,
    		type: "slot",
    		source: "(43:6) <Link to=\\\"/info\\\">",
    		ctx
    	});

    	return block;
    }

    // (47:4) <Route path="/the-conjuring">
    function create_default_slot_8(ctx) {
    	let conjuring;
    	let current;
    	conjuring = new Conjuring({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(conjuring.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(conjuring, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(conjuring.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(conjuring.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(conjuring, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_8.name,
    		type: "slot",
    		source: "(47:4) <Route path=\\\"/the-conjuring\\\">",
    		ctx
    	});

    	return block;
    }

    // (48:4) <Route path="/only-just">
    function create_default_slot_7(ctx) {
    	let onlyjust;
    	let current;
    	onlyjust = new OnlyJust({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(onlyjust.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(onlyjust, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(onlyjust.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(onlyjust.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(onlyjust, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7.name,
    		type: "slot",
    		source: "(48:4) <Route path=\\\"/only-just\\\">",
    		ctx
    	});

    	return block;
    }

    // (49:4) <Route path="/butterfly">
    function create_default_slot_6(ctx) {
    	let butterfly;
    	let current;
    	butterfly = new Butterfly({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(butterfly.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(butterfly, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(butterfly.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(butterfly.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(butterfly, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6.name,
    		type: "slot",
    		source: "(49:4) <Route path=\\\"/butterfly\\\">",
    		ctx
    	});

    	return block;
    }

    // (50:4) <Route path="/saint-sisters">
    function create_default_slot_5$1(ctx) {
    	let saintsisters;
    	let current;
    	saintsisters = new SaintSisters({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(saintsisters.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(saintsisters, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(saintsisters.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(saintsisters.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(saintsisters, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5$1.name,
    		type: "slot",
    		source: "(50:4) <Route path=\\\"/saint-sisters\\\">",
    		ctx
    	});

    	return block;
    }

    // (51:4) <Route path="/a-scarf">
    function create_default_slot_4$1(ctx) {
    	let scarf;
    	let current;
    	scarf = new Scarf({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(scarf.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(scarf, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(scarf.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(scarf.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(scarf, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4$1.name,
    		type: "slot",
    		source: "(51:4) <Route path=\\\"/a-scarf\\\">",
    		ctx
    	});

    	return block;
    }

    // (52:4) <Route path="/getting-the-electric">
    function create_default_slot_3$1(ctx) {
    	let electric;
    	let current;
    	electric = new Electric({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(electric.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(electric, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(electric.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(electric.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(electric, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$1.name,
    		type: "slot",
    		source: "(52:4) <Route path=\\\"/getting-the-electric\\\">",
    		ctx
    	});

    	return block;
    }

    // (53:4) <Route path="/info">
    function create_default_slot_2$1(ctx) {
    	let about;
    	let current;
    	about = new About({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(about.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(about, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(about.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(about.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(about, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$1.name,
    		type: "slot",
    		source: "(53:4) <Route path=\\\"/info\\\">",
    		ctx
    	});

    	return block;
    }

    // (54:4) <Route>
    function create_default_slot_1$1(ctx) {
    	let home;
    	let current;
    	home = new Home({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(home.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(home, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(home.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(home.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(home, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$1.name,
    		type: "slot",
    		source: "(54:4) <Route>",
    		ctx
    	});

    	return block;
    }

    // (35:0) <Router {url}>
    function create_default_slot$1(ctx) {
    	let blobs;
    	let t0;
    	let div;
    	let t1;
    	let header;
    	let a0;
    	let t3;
    	let nav;
    	let a1;
    	let em;
    	let t5;
    	let span;
    	let t7;
    	let link;
    	let t8;
    	let main;
    	let route0;
    	let t9;
    	let route1;
    	let t10;
    	let route2;
    	let t11;
    	let route3;
    	let t12;
    	let route4;
    	let t13;
    	let route5;
    	let t14;
    	let route6;
    	let t15;
    	let route7;
    	let current;
    	blobs = new Blobs({ $$inline: true });

    	link = new Link({
    			props: {
    				to: "/info",
    				$$slots: { default: [create_default_slot_9] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route0 = new Route({
    			props: {
    				path: "/the-conjuring",
    				$$slots: { default: [create_default_slot_8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route1 = new Route({
    			props: {
    				path: "/only-just",
    				$$slots: { default: [create_default_slot_7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route2 = new Route({
    			props: {
    				path: "/butterfly",
    				$$slots: { default: [create_default_slot_6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route3 = new Route({
    			props: {
    				path: "/saint-sisters",
    				$$slots: { default: [create_default_slot_5$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route4 = new Route({
    			props: {
    				path: "/a-scarf",
    				$$slots: { default: [create_default_slot_4$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route5 = new Route({
    			props: {
    				path: "/getting-the-electric",
    				$$slots: { default: [create_default_slot_3$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route6 = new Route({
    			props: {
    				path: "/info",
    				$$slots: { default: [create_default_slot_2$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route7 = new Route({
    			props: {
    				$$slots: { default: [create_default_slot_1$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(blobs.$$.fragment);
    			t0 = space();
    			div = element("div");
    			t1 = space();
    			header = element("header");
    			a0 = element("a");
    			a0.textContent = "View Source";
    			t3 = space();
    			nav = element("nav");
    			a1 = element("a");
    			em = element("em");
    			em.textContent = "Index";
    			t5 = space();
    			span = element("span");
    			span.textContent = " / ";
    			t7 = space();
    			create_component(link.$$.fragment);
    			t8 = space();
    			main = element("main");
    			create_component(route0.$$.fragment);
    			t9 = space();
    			create_component(route1.$$.fragment);
    			t10 = space();
    			create_component(route2.$$.fragment);
    			t11 = space();
    			create_component(route3.$$.fragment);
    			t12 = space();
    			create_component(route4.$$.fragment);
    			t13 = space();
    			create_component(route5.$$.fragment);
    			t14 = space();
    			create_component(route6.$$.fragment);
    			t15 = space();
    			create_component(route7.$$.fragment);
    			attr_dev(div, "class", "overlay svelte-17gluz5");
    			set_style(div, "background-color", /*bck*/ ctx[1]);
    			add_location(div, file$e, 36, 2, 1198);
    			attr_dev(a0, "href", "/");
    			attr_dev(a0, "class", "title-link svelte-17gluz5");
    			add_location(a0, file$e, 38, 4, 1326);
    			add_location(em, file$e, 40, 18, 1421);
    			attr_dev(a1, "href", "/");
    			add_location(a1, file$e, 40, 6, 1409);
    			add_location(span, file$e, 41, 6, 1446);
    			attr_dev(nav, "class", "header-menu");
    			add_location(nav, file$e, 39, 4, 1377);
    			attr_dev(header, "id", "app-header");
    			set_style(header, "background", /*hc*/ ctx[2]);
    			set_style(header, "opacity", /*ho*/ ctx[3]);
    			attr_dev(header, "class", "svelte-17gluz5");
    			add_location(header, file$e, 37, 2, 1257);
    			attr_dev(main, "class", "svelte-17gluz5");
    			add_location(main, file$e, 45, 2, 1543);
    		},
    		m: function mount(target, anchor) {
    			mount_component(blobs, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, header, anchor);
    			append_dev(header, a0);
    			append_dev(header, t3);
    			append_dev(header, nav);
    			append_dev(nav, a1);
    			append_dev(a1, em);
    			append_dev(nav, t5);
    			append_dev(nav, span);
    			append_dev(nav, t7);
    			mount_component(link, nav, null);
    			insert_dev(target, t8, anchor);
    			insert_dev(target, main, anchor);
    			mount_component(route0, main, null);
    			append_dev(main, t9);
    			mount_component(route1, main, null);
    			append_dev(main, t10);
    			mount_component(route2, main, null);
    			append_dev(main, t11);
    			mount_component(route3, main, null);
    			append_dev(main, t12);
    			mount_component(route4, main, null);
    			append_dev(main, t13);
    			mount_component(route5, main, null);
    			append_dev(main, t14);
    			mount_component(route6, main, null);
    			append_dev(main, t15);
    			mount_component(route7, main, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty & /*bck*/ 2) {
    				set_style(div, "background-color", /*bck*/ ctx[1]);
    			}

    			const link_changes = {};

    			if (dirty & /*$$scope*/ 16) {
    				link_changes.$$scope = { dirty, ctx };
    			}

    			link.$set(link_changes);

    			if (!current || dirty & /*hc*/ 4) {
    				set_style(header, "background", /*hc*/ ctx[2]);
    			}

    			if (!current || dirty & /*ho*/ 8) {
    				set_style(header, "opacity", /*ho*/ ctx[3]);
    			}

    			const route0_changes = {};

    			if (dirty & /*$$scope*/ 16) {
    				route0_changes.$$scope = { dirty, ctx };
    			}

    			route0.$set(route0_changes);
    			const route1_changes = {};

    			if (dirty & /*$$scope*/ 16) {
    				route1_changes.$$scope = { dirty, ctx };
    			}

    			route1.$set(route1_changes);
    			const route2_changes = {};

    			if (dirty & /*$$scope*/ 16) {
    				route2_changes.$$scope = { dirty, ctx };
    			}

    			route2.$set(route2_changes);
    			const route3_changes = {};

    			if (dirty & /*$$scope*/ 16) {
    				route3_changes.$$scope = { dirty, ctx };
    			}

    			route3.$set(route3_changes);
    			const route4_changes = {};

    			if (dirty & /*$$scope*/ 16) {
    				route4_changes.$$scope = { dirty, ctx };
    			}

    			route4.$set(route4_changes);
    			const route5_changes = {};

    			if (dirty & /*$$scope*/ 16) {
    				route5_changes.$$scope = { dirty, ctx };
    			}

    			route5.$set(route5_changes);
    			const route6_changes = {};

    			if (dirty & /*$$scope*/ 16) {
    				route6_changes.$$scope = { dirty, ctx };
    			}

    			route6.$set(route6_changes);
    			const route7_changes = {};

    			if (dirty & /*$$scope*/ 16) {
    				route7_changes.$$scope = { dirty, ctx };
    			}

    			route7.$set(route7_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(blobs.$$.fragment, local);
    			transition_in(link.$$.fragment, local);
    			transition_in(route0.$$.fragment, local);
    			transition_in(route1.$$.fragment, local);
    			transition_in(route2.$$.fragment, local);
    			transition_in(route3.$$.fragment, local);
    			transition_in(route4.$$.fragment, local);
    			transition_in(route5.$$.fragment, local);
    			transition_in(route6.$$.fragment, local);
    			transition_in(route7.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(blobs.$$.fragment, local);
    			transition_out(link.$$.fragment, local);
    			transition_out(route0.$$.fragment, local);
    			transition_out(route1.$$.fragment, local);
    			transition_out(route2.$$.fragment, local);
    			transition_out(route3.$$.fragment, local);
    			transition_out(route4.$$.fragment, local);
    			transition_out(route5.$$.fragment, local);
    			transition_out(route6.$$.fragment, local);
    			transition_out(route7.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(blobs, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(header);
    			destroy_component(link);
    			if (detaching) detach_dev(t8);
    			if (detaching) detach_dev(main);
    			destroy_component(route0);
    			destroy_component(route1);
    			destroy_component(route2);
    			destroy_component(route3);
    			destroy_component(route4);
    			destroy_component(route5);
    			destroy_component(route6);
    			destroy_component(route7);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(35:0) <Router {url}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$g(ctx) {
    	let router;
    	let t0;
    	let footer;
    	let div0;
    	let p;
    	let t1;
    	let br0;
    	let br1;
    	let t2;
    	let t3;
    	let div1;
    	let a0;
    	let img0;
    	let img0_src_value;
    	let t4;
    	let a1;
    	let img1;
    	let img1_src_value;
    	let current;

    	router = new Router({
    			props: {
    				url: /*url*/ ctx[0],
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(router.$$.fragment);
    			t0 = space();
    			footer = element("footer");
    			div0 = element("div");
    			p = element("p");
    			t1 = text("View Source is a unique online publication, curated by Fallow Media and\n      commissioned by Solas Nua, celebrating contemporary Irish literature at\n      its most adventurous.");
    			br0 = element("br");
    			br1 = element("br");
    			t2 = text("Kindly supported by Dennis Houlihan and\n      Mimi Conway.");
    			t3 = space();
    			div1 = element("div");
    			a0 = element("a");
    			img0 = element("img");
    			t4 = space();
    			a1 = element("a");
    			img1 = element("img");
    			add_location(br0, file$e, 62, 27, 2189);
    			add_location(br1, file$e, 62, 33, 2195);
    			attr_dev(p, "class", "svelte-17gluz5");
    			add_location(p, file$e, 59, 4, 2002);
    			attr_dev(div0, "class", "footer-item svelte-17gluz5");
    			add_location(div0, file$e, 58, 2, 1972);
    			attr_dev(img0, "class", "footer-logo svelte-17gluz5");
    			if (img0.src !== (img0_src_value = "/assets/images/solas-nua-logo.svg")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "Solas Nua Logo");
    			add_location(img0, file$e, 68, 6, 2348);
    			attr_dev(a0, "href", "https://solasnua.org");
    			attr_dev(a0, "class", "svelte-17gluz5");
    			add_location(a0, file$e, 67, 4, 2310);
    			attr_dev(img1, "class", "footer-logo svelte-17gluz5");
    			if (img1.src !== (img1_src_value = "/assets/images/fallow-logo.png")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "Fallow Media Logo");
    			add_location(img1, file$e, 75, 7, 2521);
    			attr_dev(a1, "href", "https://fallowmedia.com");
    			attr_dev(a1, "class", "svelte-17gluz5");
    			add_location(a1, file$e, 74, 4, 2480);
    			attr_dev(div1, "class", "footer-item svelte-17gluz5");
    			add_location(div1, file$e, 66, 2, 2280);
    			attr_dev(footer, "class", "svelte-17gluz5");
    			add_location(footer, file$e, 57, 0, 1961);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(router, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, footer, anchor);
    			append_dev(footer, div0);
    			append_dev(div0, p);
    			append_dev(p, t1);
    			append_dev(p, br0);
    			append_dev(p, br1);
    			append_dev(p, t2);
    			append_dev(footer, t3);
    			append_dev(footer, div1);
    			append_dev(div1, a0);
    			append_dev(a0, img0);
    			append_dev(div1, t4);
    			append_dev(div1, a1);
    			append_dev(a1, img1);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const router_changes = {};
    			if (dirty & /*url*/ 1) router_changes.url = /*url*/ ctx[0];

    			if (dirty & /*$$scope, hc, ho, bck*/ 30) {
    				router_changes.$$scope = { dirty, ctx };
    			}

    			router.$set(router_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(router, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(footer);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("App", slots, []);
    	let { url } = $$props;

    	onMount(() => {
    		let blobs = document.querySelectorAll(".blob");
    		[...blobs].forEach(el => move(el));
    		navigate(window.location.pathname, { replace: true });
    		document.title = "View Source";
    	});

    	let bck, hc, ho;
    	themeColour.subscribe(v => $$invalidate(1, bck = v));
    	headerOpacity.subscribe(o => $$invalidate(3, ho = o));
    	themeColour.subscribe(v => $$invalidate(2, hc = `linear-gradient(180deg, ${v} 60%, rgba(255, 255, 255, 0) 100%)`));
    	const writable_props = ["url"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("url" in $$props) $$invalidate(0, url = $$props.url);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		themeColour,
    		headerOpacity,
    		Router,
    		Link,
    		Route,
    		navigate,
    		Blobs,
    		Home,
    		About,
    		Conjuring,
    		Butterfly,
    		OnlyJust,
    		Scarf,
    		SaintSisters,
    		Electric,
    		move,
    		url,
    		bck,
    		hc,
    		ho
    	});

    	$$self.$inject_state = $$props => {
    		if ("url" in $$props) $$invalidate(0, url = $$props.url);
    		if ("bck" in $$props) $$invalidate(1, bck = $$props.bck);
    		if ("hc" in $$props) $$invalidate(2, hc = $$props.hc);
    		if ("ho" in $$props) $$invalidate(3, ho = $$props.ho);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [url, bck, hc, ho];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$g, create_fragment$g, safe_not_equal, { url: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$g.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*url*/ ctx[0] === undefined && !("url" in props)) {
    			console.warn("<App> was created without expected prop 'url'");
    		}
    	}

    	get url() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set url(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    let url = window.location.href;

    const app = new App({
    	target: document.body,
    	props: {
    		url: url
    	}
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map

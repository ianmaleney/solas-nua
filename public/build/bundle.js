
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
    			attr_dev(div0, "class", "blob svelte-19r10z6");
    			attr_dev(div0, "id", "b1");
    			add_location(div0, file$1, 22, 2, 443);
    			attr_dev(div1, "class", "blob svelte-19r10z6");
    			attr_dev(div1, "id", "b2");
    			add_location(div1, file$1, 23, 2, 489);
    			attr_dev(div2, "class", "blobs");
    			add_location(div2, file$1, 21, 0, 421);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			/*div0_binding*/ ctx[2](div0);
    			append_dev(div2, t);
    			append_dev(div2, div1);
    			/*div1_binding*/ ctx[3](div1);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			/*div0_binding*/ ctx[2](null);
    			/*div1_binding*/ ctx[3](null);
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
    	let b1, b2;

    	// Should really do this with translation, not position.
    	const move = el => {
    		let x = Math.floor(Math.random() * 100);
    		let y = Math.floor(Math.random() * 100);
    		el.style.left = `${x}vw`;
    		el.style.top = `${y}vh`;

    		setTimeout(
    			() => {
    				move(el);
    			},
    			3000
    		);
    	};

    	onMount(() => {
    		
    	}); // move(b1);
    	// move(b2);

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Blobs> was created with unknown prop '${key}'`);
    	});

    	function div0_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			b1 = $$value;
    			$$invalidate(0, b1);
    		});
    	}

    	function div1_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			b2 = $$value;
    			$$invalidate(1, b2);
    		});
    	}

    	$$self.$capture_state = () => ({ onMount, b1, b2, move });

    	$$self.$inject_state = $$props => {
    		if ("b1" in $$props) $$invalidate(0, b1 = $$props.b1);
    		if ("b2" in $$props) $$invalidate(1, b2 = $$props.b2);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [b1, b2, div0_binding, div1_binding];
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

    // (14:6) <Link to="/getting-the-electric"         >
    function create_default_slot_5(ctx) {
    	let em;
    	let t1;

    	const block = {
    		c: function create() {
    			em = element("em");
    			em.textContent = "Getting The Electric";
    			t1 = text(" · Louise Hegarty");
    			add_location(em, file$2, 14, 9, 382);
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
    		source: "(14:6) <Link to=\\\"/getting-the-electric\\\"         >",
    		ctx
    	});

    	return block;
    }

    // (19:6) <Link to="/a-scarf"         >
    function create_default_slot_4(ctx) {
    	let em;
    	let t1;

    	const block = {
    		c: function create() {
    			em = element("em");
    			em.textContent = "A Scarf";
    			t1 = text(" · Doireann Ní Ghríofa");
    			add_location(em, file$2, 19, 9, 514);
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
    		source: "(19:6) <Link to=\\\"/a-scarf\\\"         >",
    		ctx
    	});

    	return block;
    }

    // (24:6) <Link to="/saint-sisters"         >
    function create_default_slot_3(ctx) {
    	let em;
    	let t1;

    	const block = {
    		c: function create() {
    			em = element("em");
    			em.textContent = "Saint Sisters And The Sea";
    			t1 = text(" · Méabh de Brún");
    			add_location(em, file$2, 24, 9, 644);
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
    		source: "(24:6) <Link to=\\\"/saint-sisters\\\"         >",
    		ctx
    	});

    	return block;
    }

    // (29:6) <Link to="/butterfly"         >
    function create_default_slot_2(ctx) {
    	let em;
    	let t1;

    	const block = {
    		c: function create() {
    			em = element("em");
    			em.textContent = "Butterfly";
    			t1 = text(" · Colm O'Shea");
    			add_location(em, file$2, 29, 9, 782);
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
    		source: "(29:6) <Link to=\\\"/butterfly\\\"         >",
    		ctx
    	});

    	return block;
    }

    // (34:6) <Link to="/only-just"         >
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
    			add_location(em0, file$2, 34, 9, 902);
    			add_location(em1, file$2, 35, 8, 972);
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
    		source: "(34:6) <Link to=\\\"/only-just\\\"         >",
    		ctx
    	});

    	return block;
    }

    // (40:6) <Link to="/the-conjuring"         >
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
    			add_location(em0, file$2, 40, 9, 1079);
    			add_location(em1, file$2, 43, 36, 1214);
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
    		source: "(40:6) <Link to=\\\"/the-conjuring\\\"         >",
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
    			attr_dev(li0, "class", "svelte-1ccrjbn");
    			add_location(li0, file$2, 12, 4, 329);
    			attr_dev(li1, "class", "svelte-1ccrjbn");
    			add_location(li1, file$2, 17, 4, 474);
    			attr_dev(li2, "class", "svelte-1ccrjbn");
    			add_location(li2, file$2, 22, 4, 598);
    			attr_dev(li3, "class", "svelte-1ccrjbn");
    			add_location(li3, file$2, 27, 4, 740);
    			attr_dev(li4, "class", "svelte-1ccrjbn");
    			add_location(li4, file$2, 32, 4, 860);
    			attr_dev(li5, "class", "svelte-1ccrjbn");
    			add_location(li5, file$2, 38, 4, 1033);
    			attr_dev(ul, "id", "toc");
    			attr_dev(ul, "class", "svelte-1ccrjbn");
    			add_location(ul, file$2, 11, 2, 311);
    			attr_dev(nav, "id", "home-nav");
    			attr_dev(nav, "class", "svelte-1ccrjbn");
    			add_location(nav, file$2, 6, 0, 147);
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
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Home> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Link, blur, linear: identity });
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

    /* src/routes/About.svelte generated by Svelte v3.32.3 */
    const file$3 = "src/routes/About.svelte";

    function create_fragment$5(ctx) {
    	let div;
    	let h1;
    	let t1;
    	let p0;
    	let t3;
    	let p1;
    	let t5;
    	let p2;
    	let t7;
    	let p3;
    	let t9;
    	let p4;
    	let t11;
    	let p5;
    	let t13;
    	let p6;
    	let t15;
    	let h2;
    	let t17;
    	let p7;
    	let div_intro;
    	let div_outro;
    	let current;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h1 = element("h1");
    			h1.textContent = "Irish Book Day: View Source";
    			t1 = space();
    			p0 = element("p");
    			p0.textContent = "Expanding on our long tradition of providing Washington D.C. with free Irish\n    books on St. Patrick’s Day, this year Solas Nua is staying green and\n    producing another digital offering - online and available anywhere in the\n    world to view on-screen, print-at-home, or even kick back and listen to.";
    			t3 = space();
    			p1 = element("p");
    			p1.textContent = "View Source is a unique online publication, curated by Fallow Media and\n    commissioned by Solas Nua, celebrating contemporary Irish literature at its\n    most adventurous.";
    			t5 = space();
    			p2 = element("p");
    			p2.textContent = "Working alongside six cutting-edge literary publications in Ireland today –\n    The Stinging Fly, The Dublin Review, Gorse, Banshee, Winter Papers, and\n    Fallow Media – View Source has invited writers and artists to reimagine\n    stories, poems, and essays first made available in print.";
    			t7 = space();
    			p3 = element("p");
    			p3.textContent = "Taking advantage of the many possibilities of publishing on the internet,\n    View Source presents each text in multiple ways, giving visitors the\n    opportunity to choose how they want to experience each piece through unique\n    on-screen design, creative audio, or a print-at-home publication.";
    			t9 = space();
    			p4 = element("p");
    			p4.textContent = "The temporary loss of bookstores and literary gatherings is just one of the\n    many changes wrought by the Covid-19 pandemic. View Source uses this moment\n    of confusion and crisis to ask what opportunities might lie hidden within\n    our global shift to online spaces. By publishing this work digitally,\n    contemporary Irish literature becomes accessible in new ways to new\n    audiences, reaching people who might never otherwise have access to it. So\n    what could a book, a journal, a story look like online? How might we use the\n    specific strengths of the internet to expand the literary text and break\n    down the borders between different media? Most importantly, how might\n    readers discover new and meaningful connections to this work?";
    			t11 = space();
    			p5 = element("p");
    			p5.textContent = "View Source brings together the talents of many contemporary Irish writers\n    and artists, including: Claire-Louise Bennett, Ruby Wallis, Colm O'Shea, Tom\n    Roseingrave, Méabh de Brún, Nidhi Zak/Aria Eipe, Michael Dooley, and Louise\n    Hegarty. Throughout the publication, the finest writing blends with\n    inventive audio and visual work to create a truly special literary\n    experience.";
    			t13 = space();
    			p6 = element("p");
    			p6.textContent = "The launch will be marked with a series of events to be confirmed. Details\n    to follow soon on how to access your copy of View Source on St. Patrick’s\n    Day.";
    			t15 = space();
    			h2 = element("h2");
    			h2.textContent = "About Fallow Media";
    			t17 = space();
    			p7 = element("p");
    			p7.textContent = "With the belief that the internet offers us critical and conceptual\n    approaches that remain largely unexplored in the worlds of literature, music\n    and the arts, Fallow Media has become an alternative space for contemporary\n    creativity in Ireland. Each project is a learning process, and an attempt to\n    share work from across the artistic spectrum in a new way. The hope is not\n    only to change the way people see this work, but also the way work is\n    created in the first place.";
    			add_location(h1, file$3, 10, 2, 269);
    			add_location(p0, file$3, 11, 2, 308);
    			add_location(p1, file$3, 17, 2, 630);
    			add_location(p2, file$3, 22, 2, 821);
    			add_location(p3, file$3, 28, 2, 1128);
    			add_location(p4, file$3, 34, 2, 1442);
    			add_location(p5, file$3, 46, 2, 2216);
    			add_location(p6, file$3, 54, 2, 2628);
    			add_location(h2, file$3, 60, 2, 2808);
    			add_location(p7, file$3, 61, 2, 2838);
    			attr_dev(div, "class", "text");
    			add_location(div, file$3, 5, 0, 106);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h1);
    			append_dev(div, t1);
    			append_dev(div, p0);
    			append_dev(div, t3);
    			append_dev(div, p1);
    			append_dev(div, t5);
    			append_dev(div, p2);
    			append_dev(div, t7);
    			append_dev(div, p3);
    			append_dev(div, t9);
    			append_dev(div, p4);
    			append_dev(div, t11);
    			append_dev(div, p5);
    			append_dev(div, t13);
    			append_dev(div, p6);
    			append_dev(div, t15);
    			append_dev(div, h2);
    			append_dev(div, t17);
    			append_dev(div, p7);
    			current = true;
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    		},
    		i: function intro(local) {
    			if (current) return;

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
    			if (detaching) detach_dev(div);
    			if (detaching && div_outro) div_outro.end();
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
    	validate_slots("About", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<About> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ blur, linear: identity });
    	return [];
    }

    class About extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "About",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src/routes/pieces/Conjuring.svelte generated by Svelte v3.32.3 */
    const file$4 = "src/routes/pieces/Conjuring.svelte";

    function create_fragment$6(ctx) {
    	let div2;
    	let div0;
    	let p0;
    	let t0;
    	let br0;
    	let t1;
    	let br1;
    	let t2;
    	let br2;
    	let t3;
    	let t4;
    	let p1;
    	let t5;
    	let br3;
    	let t6;
    	let br4;
    	let t7;
    	let br5;
    	let t8;
    	let t9;
    	let p2;
    	let t10;
    	let br6;
    	let t11;
    	let br7;
    	let t12;
    	let br8;
    	let t13;
    	let t14;
    	let p3;
    	let t15;
    	let br9;
    	let t16;
    	let br10;
    	let t17;
    	let br11;
    	let t18;
    	let t19;
    	let p4;
    	let t20;
    	let br12;
    	let t21;
    	let br13;
    	let t22;
    	let br14;
    	let t23;
    	let t24;
    	let p5;
    	let t25;
    	let br15;
    	let t26;
    	let br16;
    	let t27;
    	let br17;
    	let t28;
    	let t29;
    	let p6;
    	let t30;
    	let br18;
    	let t31;
    	let br19;
    	let t32;
    	let br20;
    	let t33;
    	let t34;
    	let p7;
    	let t35;
    	let br21;
    	let t36;
    	let br22;
    	let t37;
    	let br23;
    	let t38;
    	let t39;
    	let div1;
    	let p8;
    	let t40;
    	let br24;
    	let t41;
    	let br25;
    	let t42;
    	let br26;
    	let t43;
    	let br27;
    	let t44;
    	let br28;
    	let t45;
    	let br29;
    	let t46;
    	let br30;
    	let t47;
    	let br31;
    	let t48;
    	let br32;
    	let t49;
    	let br33;
    	let t50;
    	let br34;
    	let t51;
    	let t52;
    	let p9;
    	let t53;
    	let br35;
    	let t54;
    	let br36;
    	let t55;
    	let br37;
    	let t56;
    	let br38;
    	let t57;
    	let br39;
    	let t58;
    	let br40;
    	let t59;
    	let br41;
    	let t60;
    	let br42;
    	let t61;
    	let br43;
    	let t62;
    	let br44;
    	let t63;
    	let br45;
    	let t64;
    	let br46;
    	let t65;
    	let br47;
    	let t66;
    	let br48;
    	let t67;
    	let div2_intro;
    	let div2_outro;
    	let current;

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			p0 = element("p");
    			t0 = text("how a horse, or more, rose");
    			br0 = element("br");
    			t1 = text("\n      from the water, still and gray");
    			br1 = element("br");
    			t2 = text("\n      as a lake how could they know");
    			br2 = element("br");
    			t3 = text("\n      the truth: an ambush of snow");
    			t4 = space();
    			p1 = element("p");
    			t5 = text("how the crane called to its kin");
    			br3 = element("br");
    			t6 = text("\n      faint, auriga moving through");
    			br4 = element("br");
    			t7 = text("\n      a home, stranger, a shadow");
    			br5 = element("br");
    			t8 = text("\n      falling low across the limen");
    			t9 = space();
    			p2 = element("p");
    			t10 = text("how a mare stood sentinel");
    			br6 = element("br");
    			t11 = text("\n      by the door, wise eyes wide");
    			br7 = element("br");
    			t12 = text("\n      unblinking foaling sprawling");
    			br8 = element("br");
    			t13 = text("\n      twin kings, a flagstone floor");
    			t14 = space();
    			p3 = element("p");
    			t15 = text("how we bore your temper wild");
    			br9 = element("br");
    			t16 = text("\n      spur upon our backs a man");
    			br10 = element("br");
    			t17 = text("\n      hounded, as our mother yet");
    			br11 = element("br");
    			t18 = text("\n      outruns us, how she stuns us");
    			t19 = space();
    			p4 = element("p");
    			t20 = text("with her pain, mooned belly");
    			br12 = element("br");
    			t21 = text("\n      heaving life, sharp her cries");
    			br13 = element("br");
    			t22 = text("\n      cursing their men days five");
    			br14 = element("br");
    			t23 = text("\n      lineal nine across the line");
    			t24 = space();
    			p5 = element("p");
    			t25 = text("how the birds shift beneath");
    			br15 = element("br");
    			t26 = text("\n      lust’s gaze, how they turned");
    			br16 = element("br");
    			t27 = text("\n      on you, swift as a whipping");
    			br17 = element("br");
    			t28 = text("\n      boy caught in a bind of rage");
    			t29 = space();
    			p6 = element("p");
    			t30 = text("how they trembled, the fury");
    			br18 = element("br");
    			t31 = text("\n      filled sprites as you suffered");
    			br19 = element("br");
    			t32 = text("\n      the life you were denied then");
    			br20 = element("br");
    			t33 = text("\n      married to the envy of a bride");
    			t34 = space();
    			p7 = element("p");
    			t35 = text("how they’ll swear you loved");
    			br21 = element("br");
    			t36 = text("\n      but one of us, singular, true:");
    			br22 = element("br");
    			t37 = text("\n      balking, bridled, only one —");
    			br23 = element("br");
    			t38 = text("\n      brother standing before you.");
    			t39 = space();
    			div1 = element("div");
    			p8 = element("p");
    			t40 = text("You were first from the shore of her, the dam who slipped us in the dark; ");
    			br24 = element("br");
    			t41 = text("\n      who slung like coin her womb’s worth at the door, left us to weave our tongues");
    			br25 = element("br");
    			t42 = text("\n      in each other’s eyes; to lick the water from our backs, the Moorhen at our\n      mouths. ");
    			br26 = element("br");
    			t43 = text("\n      I smelled her once in fog, the night the sounds of war split beyond the fort\n      — ");
    			br27 = element("br");
    			t44 = text("\n      trills of curlew magicked into cries of slaughtered men, wind-tap of branches\n      ");
    			br28 = element("br");
    			t45 = text("\n      shaped to clanging blades. And when they saddled us and led us");
    			br29 = element("br");
    			t46 = text("\n      to the Valley of the Deaf, we tasted her on grasses, in the downwind rot\n      ");
    			br30 = element("br");
    			t47 = text("\n      of that hooked and sweet-flowered tree; heard her heave in the draws of river,\n      ");
    			br31 = element("br");
    			t48 = text("\n      her groan in pushing us from pools — white cascades popping at the falls\n      ");
    			br32 = element("br");
    			t49 = text("\n      our birth-bleached hooves. Was she in the blood that let from your eye?\n      ");
    			br33 = element("br");
    			t50 = text("\n      That shape aroused in the wine that spilled three times, or in the woman at\n      the crossing ford, ");
    			br34 = element("br");
    			t51 = text("\n      all sorrows and spoiled armour, who wept he was to die? Was her snort the gale\n      that lunged");
    			t52 = space();
    			p9 = element("p");
    			t53 = text("a spear of some warrior’s spited kin, tore Láegh from his root like a\n      soft-soiled yew, ");
    			br35 = element("br");
    			t54 = text("\n      ran him as a spring beneath our hocks? What could I but run, and Cú Chulainn\n      torn ");
    			br36 = element("br");
    			t55 = text("\n      like a bag of meal, regarding with wonder that hole in himself — little rat\n      rip, ");
    			br37 = element("br");
    			t56 = text("\n      clean as a saddler’s punch — like a blink in recollection, or a net laboured\n      into shore ");
    			br38 = element("br");
    			t57 = text("\n      only to see it fat with his own catch, and picked by many hands? I left him\n      for the sorceresses, ");
    			br39 = element("br");
    			t58 = text("\n      and salmon-snorted home; broke woodlands with my goosegrass breast, stamped\n      crescents ");
    			br40 = element("br");
    			t59 = text("\n      in mud and shale, startled a hag turning rope in the dew, passed strangers’\n      palisades, ");
    			br41 = element("br");
    			t60 = text("\n      and laughing children mad like calves at dusk, until I stood and shook before\n      water in the glen. ");
    			br42 = element("br");
    			t61 = text("\n      And when I dipped my shameful head to step beneath a mirror of the moon, your\n      form went hurtling");
    			br43 = element("br");
    			t62 = text(" from the shimmer of my lips: turning in the\n      bindweed root like an otter hunting crays; ");
    			br44 = element("br");
    			t63 = text("\n      broken pottery of skulls a shingle beneath your feet, the thirty skins behind\n      your teeth. ");
    			br45 = element("br");
    			t64 = text("\n      And I saw Cú Chulainn, too, pinned to the stone in his own twines, a sick-cloth\n      fluttering ");
    			br46 = element("br");
    			t65 = text("\n      in wind, in current; saw the raven berry-picking hedges of his bursting sides.");
    			br47 = element("br");
    			t66 = text("\n      I will leave this Milesian pit, this festered wound in water; will slip beneath\n      the tail of it, ");
    			br48 = element("br");
    			t67 = text("\n      grow wings again and drown, before her.");
    			add_location(br0, file$4, 12, 32, 336);
    			add_location(br1, file$4, 13, 36, 379);
    			add_location(br2, file$4, 14, 35, 421);
    			add_location(p0, file$4, 11, 4, 300);
    			add_location(br3, file$4, 19, 37, 518);
    			add_location(br4, file$4, 20, 34, 559);
    			add_location(br5, file$4, 21, 32, 598);
    			add_location(p1, file$4, 18, 4, 477);
    			add_location(br6, file$4, 26, 31, 689);
    			add_location(br7, file$4, 27, 33, 729);
    			add_location(br8, file$4, 28, 34, 770);
    			add_location(p2, file$4, 25, 4, 654);
    			add_location(br9, file$4, 33, 34, 865);
    			add_location(br10, file$4, 34, 31, 903);
    			add_location(br11, file$4, 35, 32, 942);
    			add_location(p3, file$4, 32, 4, 827);
    			add_location(br12, file$4, 40, 33, 1035);
    			add_location(br13, file$4, 41, 35, 1077);
    			add_location(br14, file$4, 42, 33, 1117);
    			add_location(p4, file$4, 39, 4, 998);
    			add_location(br15, file$4, 47, 33, 1209);
    			add_location(br16, file$4, 48, 34, 1250);
    			add_location(br17, file$4, 49, 33, 1290);
    			add_location(p5, file$4, 46, 4, 1172);
    			add_location(br18, file$4, 54, 33, 1383);
    			add_location(br19, file$4, 55, 36, 1426);
    			add_location(br20, file$4, 56, 35, 1468);
    			add_location(p6, file$4, 53, 4, 1346);
    			add_location(br21, file$4, 61, 33, 1563);
    			add_location(br22, file$4, 62, 36, 1606);
    			add_location(br23, file$4, 63, 34, 1647);
    			add_location(p7, file$4, 60, 4, 1526);
    			attr_dev(div0, "class", "half svelte-rvhj5y");
    			add_location(div0, file$4, 10, 2, 277);
    			add_location(br24, file$4, 69, 80, 1816);
    			add_location(br25, file$4, 71, 84, 1913);
    			add_location(br26, file$4, 74, 14, 2021);
    			add_location(br27, file$4, 76, 8, 2119);
    			add_location(br28, file$4, 78, 6, 2216);
    			add_location(br29, file$4, 79, 68, 2291);
    			add_location(br30, file$4, 81, 6, 2383);
    			add_location(br31, file$4, 83, 6, 2481);
    			add_location(br32, file$4, 85, 6, 2573);
    			add_location(br33, file$4, 87, 6, 2664);
    			add_location(br34, file$4, 89, 25, 2778);
    			add_location(p8, file$4, 68, 4, 1732);
    			add_location(br35, file$4, 95, 23, 3004);
    			add_location(br36, file$4, 97, 11, 3105);
    			add_location(br37, file$4, 99, 11, 3205);
    			add_location(br38, file$4, 101, 17, 3312);
    			add_location(br39, file$4, 103, 27, 3428);
    			add_location(br40, file$4, 105, 16, 3533);
    			add_location(br41, file$4, 107, 17, 3639);
    			add_location(br42, file$4, 109, 25, 3755);
    			add_location(br43, file$4, 111, 24, 3870);
    			add_location(br44, file$4, 112, 49, 3970);
    			add_location(br45, file$4, 114, 18, 4079);
    			add_location(br46, file$4, 116, 17, 4189);
    			add_location(br47, file$4, 117, 84, 4280);
    			add_location(br48, file$4, 120, 22, 4401);
    			add_location(p9, file$4, 93, 4, 2901);
    			attr_dev(div1, "class", "half svelte-rvhj5y");
    			add_location(div1, file$4, 67, 2, 1709);
    			attr_dev(div2, "class", "poem-wrapper svelte-rvhj5y");
    			add_location(div2, file$4, 5, 0, 106);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div0, p0);
    			append_dev(p0, t0);
    			append_dev(p0, br0);
    			append_dev(p0, t1);
    			append_dev(p0, br1);
    			append_dev(p0, t2);
    			append_dev(p0, br2);
    			append_dev(p0, t3);
    			append_dev(div0, t4);
    			append_dev(div0, p1);
    			append_dev(p1, t5);
    			append_dev(p1, br3);
    			append_dev(p1, t6);
    			append_dev(p1, br4);
    			append_dev(p1, t7);
    			append_dev(p1, br5);
    			append_dev(p1, t8);
    			append_dev(div0, t9);
    			append_dev(div0, p2);
    			append_dev(p2, t10);
    			append_dev(p2, br6);
    			append_dev(p2, t11);
    			append_dev(p2, br7);
    			append_dev(p2, t12);
    			append_dev(p2, br8);
    			append_dev(p2, t13);
    			append_dev(div0, t14);
    			append_dev(div0, p3);
    			append_dev(p3, t15);
    			append_dev(p3, br9);
    			append_dev(p3, t16);
    			append_dev(p3, br10);
    			append_dev(p3, t17);
    			append_dev(p3, br11);
    			append_dev(p3, t18);
    			append_dev(div0, t19);
    			append_dev(div0, p4);
    			append_dev(p4, t20);
    			append_dev(p4, br12);
    			append_dev(p4, t21);
    			append_dev(p4, br13);
    			append_dev(p4, t22);
    			append_dev(p4, br14);
    			append_dev(p4, t23);
    			append_dev(div0, t24);
    			append_dev(div0, p5);
    			append_dev(p5, t25);
    			append_dev(p5, br15);
    			append_dev(p5, t26);
    			append_dev(p5, br16);
    			append_dev(p5, t27);
    			append_dev(p5, br17);
    			append_dev(p5, t28);
    			append_dev(div0, t29);
    			append_dev(div0, p6);
    			append_dev(p6, t30);
    			append_dev(p6, br18);
    			append_dev(p6, t31);
    			append_dev(p6, br19);
    			append_dev(p6, t32);
    			append_dev(p6, br20);
    			append_dev(p6, t33);
    			append_dev(div0, t34);
    			append_dev(div0, p7);
    			append_dev(p7, t35);
    			append_dev(p7, br21);
    			append_dev(p7, t36);
    			append_dev(p7, br22);
    			append_dev(p7, t37);
    			append_dev(p7, br23);
    			append_dev(p7, t38);
    			append_dev(div2, t39);
    			append_dev(div2, div1);
    			append_dev(div1, p8);
    			append_dev(p8, t40);
    			append_dev(p8, br24);
    			append_dev(p8, t41);
    			append_dev(p8, br25);
    			append_dev(p8, t42);
    			append_dev(p8, br26);
    			append_dev(p8, t43);
    			append_dev(p8, br27);
    			append_dev(p8, t44);
    			append_dev(p8, br28);
    			append_dev(p8, t45);
    			append_dev(p8, br29);
    			append_dev(p8, t46);
    			append_dev(p8, br30);
    			append_dev(p8, t47);
    			append_dev(p8, br31);
    			append_dev(p8, t48);
    			append_dev(p8, br32);
    			append_dev(p8, t49);
    			append_dev(p8, br33);
    			append_dev(p8, t50);
    			append_dev(p8, br34);
    			append_dev(p8, t51);
    			append_dev(div1, t52);
    			append_dev(div1, p9);
    			append_dev(p9, t53);
    			append_dev(p9, br35);
    			append_dev(p9, t54);
    			append_dev(p9, br36);
    			append_dev(p9, t55);
    			append_dev(p9, br37);
    			append_dev(p9, t56);
    			append_dev(p9, br38);
    			append_dev(p9, t57);
    			append_dev(p9, br39);
    			append_dev(p9, t58);
    			append_dev(p9, br40);
    			append_dev(p9, t59);
    			append_dev(p9, br41);
    			append_dev(p9, t60);
    			append_dev(p9, br42);
    			append_dev(p9, t61);
    			append_dev(p9, br43);
    			append_dev(p9, t62);
    			append_dev(p9, br44);
    			append_dev(p9, t63);
    			append_dev(p9, br45);
    			append_dev(p9, t64);
    			append_dev(p9, br46);
    			append_dev(p9, t65);
    			append_dev(p9, br47);
    			append_dev(p9, t66);
    			append_dev(p9, br48);
    			append_dev(p9, t67);
    			current = true;
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    		},
    		i: function intro(local) {
    			if (current) return;

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
    			if (detaching) detach_dev(div2);
    			if (detaching && div2_outro) div2_outro.end();
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
    	validate_slots("Conjuring", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Conjuring> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ blur, linear: identity });
    	return [];
    }

    class Conjuring extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Conjuring",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

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
    function create_if_block$1(ctx) {
    	let span;
    	let t;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(/*credits*/ ctx[2]);
    			attr_dev(span, "class", "credits svelte-12bon20");
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
    		id: create_if_block$1.name,
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

    	let if_block = /*credits*/ ctx[2] && create_if_block$1(ctx);

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
    			attr_dev(div0, "class", "audiotime svelte-12bon20");
    			add_location(div0, file$7, 39, 4, 886);
    			attr_dev(div1, "class", "controls svelte-12bon20");
    			add_location(div1, file$7, 34, 2, 744);
    			attr_dev(div2, "id", "audioPlayer");
    			attr_dev(div2, "class", "svelte-12bon20");
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
    					if_block = create_if_block$1(ctx);
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

    /* src/routes/pieces/Butterfly.svelte generated by Svelte v3.32.3 */
    const file$8 = "src/routes/pieces/Butterfly.svelte";

    function create_fragment$a(ctx) {
    	let div2;
    	let header;
    	let h1;
    	let t1;
    	let h2;
    	let t3;
    	let div0;
    	let button0;
    	let t5;
    	let button1;
    	let t7;
    	let audioplayer;
    	let t8;
    	let div1;
    	let p0;
    	let t10;
    	let p1;
    	let t12;
    	let p2;
    	let t14;
    	let p3;
    	let t16;
    	let p4;
    	let t18;
    	let p5;
    	let t20;
    	let p6;
    	let t22;
    	let p7;
    	let t24;
    	let p8;
    	let t26;
    	let p9;
    	let t28;
    	let p10;
    	let t30;
    	let p11;
    	let t32;
    	let p12;
    	let t34;
    	let p13;
    	let t36;
    	let p14;
    	let t38;
    	let p15;
    	let t40;
    	let p16;
    	let t42;
    	let p17;
    	let t44;
    	let p18;
    	let t46;
    	let p19;
    	let t48;
    	let p20;
    	let t50;
    	let p21;
    	let t52;
    	let p22;
    	let t54;
    	let p23;
    	let t56;
    	let p24;
    	let t58;
    	let p25;
    	let t60;
    	let p26;
    	let t62;
    	let p27;
    	let t64;
    	let p28;
    	let t66;
    	let p29;
    	let t68;
    	let p30;
    	let t70;
    	let p31;
    	let t72;
    	let p32;
    	let t74;
    	let p33;
    	let t76;
    	let p34;
    	let t78;
    	let p35;
    	let t80;
    	let p36;
    	let t82;
    	let p37;
    	let t84;
    	let p38;
    	let t86;
    	let p39;
    	let t88;
    	let p40;
    	let t90;
    	let p41;
    	let t92;
    	let p42;
    	let t94;
    	let p43;
    	let t96;
    	let p44;
    	let div2_intro;
    	let div2_outro;
    	let current;
    	let mounted;
    	let dispose;

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
    			div2 = element("div");
    			header = element("header");
    			h1 = element("h1");
    			h1.textContent = "Butterfly";
    			t1 = space();
    			h2 = element("h2");
    			h2.textContent = "Colm O'Shea";
    			t3 = space();
    			div0 = element("div");
    			button0 = element("button");
    			button0.textContent = "Listen";
    			t5 = space();
    			button1 = element("button");
    			button1.textContent = "Print";
    			t7 = space();
    			create_component(audioplayer.$$.fragment);
    			t8 = space();
    			div1 = element("div");
    			p0 = element("p");
    			p0.textContent = "A border is a line made by man. A border is a line made by woman. A border\n      is not real. A border is an agreement that something unreal is real. A\n      border is an agreed exclusion. A border is a way of saying what is here\n      and what is there are different. A border is a way of describing a\n      difference.";
    			t10 = space();
    			p1 = element("p");
    			p1.textContent = "It starts in the airport. It starts before the airport. It starts by not\n      saying, by not telling. It starts in the airport, looking around without\n      being seen to look around for faces who would not know why I am in the\n      airport. It’s about not being seen. It’s about making up excuses, making\n      up stories. It’s about being consistent in my stories. It’s about telling\n      people the same lie. It’s about knowing it’s best to tell one lie. It’s\n      about knowing that one lie is easier to remember, one lie is easier to not\n      trip over, one lie is less likely to be questioned if everyone believes it\n      to be true. It’s about lying about being somewhere else when you’re in an\n      airport.";
    			t12 = space();
    			p2 = element("p");
    			p2.textContent = "She has to know where every border is. She can’t get caught. She can’t get\n      caught out. She has to know where everything stops and everything starts.\n      It’s a survival instinct. It’s automatic now. She has to read every\n      situation and know where she is. She has to know whether she’s crossed a\n      border and how to act. She has to know how near she is to a border, and\n      whether to turn and go back or prepare to cross over. She has to be\n      whatever is expected of her on any side of any border.";
    			t14 = space();
    			p3 = element("p");
    			p3.textContent = "In a room listening to the artist Tamarin Norwood speak. I know the other\n      speakers but not her. That is, I’ve heard others mention her and her work,\n      but have never come across it until now. I strain to remember what is\n      being said, what she is saying. I know I will forget a lot of what she is\n      saying. I always do. I’m hoping someone is recording the event but I’ll\n      find out later that no one is. I won’t be the only one regretting that the\n      event isn’t being recorded.";
    			t16 = space();
    			p4 = element("p");
    			p4.textContent = "A border is a boundary. A border is more than a line drawn in the sand. A\n      border is a line drawn to mean something more than a line. A border is\n      meant to say more about what is beyond the line, on either side. A border\n      becomes nothing when you see a border because a border is a line drawn and\n      a line drawn only has the thickness it has been given. A border drawn can\n      be reduced to nothing if you allow it because a line can be reduced to\n      nothing if you allow it, but a border is a shared belief that a line means\n      something.";
    			t18 = space();
    			p5 = element("p");
    			p5.textContent = "Crossing the border doesn’t make it any easier. Crossing the border is\n      when real field craft comes into play. Crossing the border means there can\n      be no excuses, no stories, no lies. Getting caught crossing a border means\n      no escape. Even before the airport and the border it’s the messages and\n      the codes. It’s the letter drops and the fake names. It’s covering tracks.\n      Field craft teaches you that it’s easier to cover tracks before you’ve\n      even made them. It’s easier now and it’s harder. Different contacts,\n      different names, different addresses. Knowing who she is when she contacts\n      you even if the name isn’t your name for her. Knowing how to respond.\n      Knowing which questions are safe to ask and which will only cause trouble.\n      Field craft is knowing how much I can say without the risk of blowing her\n      cover, or mine.";
    			t20 = space();
    			p6 = element("p");
    			p6.textContent = "A line means something. A line means direction. A line is a vector. A line\n      can be a vector but either side of a line is nothing unless you say it is\n      something, unless you agree it is something. A line becomes a border when\n      either side of the line means more than the line itself.";
    			t22 = space();
    			p7 = element("p");
    			p7.textContent = "The first train is the greatest risk, it’s the greatest risk of being\n      spotted. I try to find a seat to stay inconspicuous but it’s standing room\n      only. It means I can watch the stations as we approach. It means I can\n      make a dash for the door before I’m spotted. It means I’m on edge the\n      entire time. Ignore what’s outside the windows. Don’t be a tourist, don’t\n      be a visitor. Blend in. Disappear. Be like everyone else. Glance at what\n      passes by the window the same way everyone else glances at what passes by\n      the window because we’ve all seen it a million times before. Don’t meet\n      anyone’s eyes, without meaning to not meet their eyes. Everyone else on\n      the train is a potential trap. Everyone else on the train could be the\n      cause of getting caught.";
    			t24 = space();
    			p8 = element("p");
    			p8.textContent = "The room is full. I arrive early, earlier than I had planned, and take a\n      seat away from the door. Watch the room fill up. The rest of the audience\n      will know the other speakers, and her and her work, far better than I\n      will. I know I will paraphrase. I know I will misinterpret. I know I will\n      want to speak to her after the event but I will never get the chance. That\n      is, I will be sitting in the pub after the event with friends and she will\n      be sitting nearby with friends and I will mean to dip into her\n      conversation on the way out to tell her how interesting I found the\n      evening, hearing her speak, hearing her explain her work. But when the end\n      of the evening comes, when the end of my evening comes and I put my coat\n      on to leave, I say nothing to her.";
    			t26 = space();
    			p9 = element("p");
    			p9.textContent = "She has to be invisible. She has to be discrete. She has to be at home\n      wherever she stands. She is a spy. She has to live as a spy. When she\n      speaks she has to know how to speak. When she speaks she has to know what\n      name to give and to stick with that name. The easiest way for a spy to\n      have their cover blown is to trip themselves up. Inconsistency means\n      death. She has to know where she is, stick to being whoever she is on that\n      side of that border and never waiver.";
    			t28 = space();
    			p10 = element("p");
    			p10.textContent = "A place has no meaning without a border. A place is a space given a name\n      by a man. A place is a space given a name by a woman. A place has no\n      meaning without a border. A place is a nothing until it comes to an end;\n      otherwise it is just a nothing. A place has no meaning until it meets\n      another place. A place and a place only have meaning in themselves when\n      they meet. When two places meet and become something it is the border that\n      gives them meaning. So that means places have no meaning without a border\n      which has no meaning without it being given a meaning by a man or a woman,\n      by men or women.";
    			t30 = space();
    			p11 = element("p");
    			p11.textContent = "I haven’t messaged her yet. I meant to before I left the airport but I\n      walked in the middle of a group all moving in the same direction. I’m less\n      likely to be picked out that way. I have my papers if needed but the less\n      chance I give them to ask me any questions the better my chances are. I\n      count the stations before I have to change trains. I don’t look up. I’m as\n      bored as everyone else beside me. I should message her. I look at my phone\n      but it’s as much to avoid looking up as anything else. I have no signal\n      but I know I’ll have a chance when I change trains. The platforms are\n      crowded but staying in the middle is the safest place of all. Changing\n      trains means emerging into the open air before going underground again.";
    			t32 = space();
    			p12 = element("p");
    			p12.textContent = "Places have no meaning until they are given a meaning by giving them a\n      name. Nothing has a meaning until it is given a name. Nothing exists until\n      it is given a name. A butterfly does not exist until it is named. A\n      non-existent butterfly is free to cross a non-existent border. To name a\n      butterfly is to catch it. To catch a butterfly is to want to hold it in\n      your hands. To catch a butterfly is to risk crushing it. No butterfly\n      seeks out the net. A name is also a limit. A name is a limit given by\n      somebody else. A butterfly does not exist until it is captured and killed\n      and stuck to a board with a pin through its heart. Is a pin only a pin and\n      a butterfly only a butterfly when they come into contact? A butterfly only\n      has a name when a difference is defined between one butterfly and another.\n      A butterfly only exists when a line is drawn between one butterfly and\n      another. A butterfly only exists when a border is drawn between one\n      butterfly and another by a man or a woman. Metaphor is murder.";
    			t34 = space();
    			p13 = element("p");
    			p13.textContent = "I message her to say I’m on my way. Nothing more. Nothing less. If they\n      know I’m here we’re caught anyway. If not it’s just the same message as\n      hundreds, if not thousands, are sending this moment across the city.\n      Changing trains means a safer train. I’m less likely to be spotted now.\n      Moving through a safer part of town. I take a seat, holding my bag in\n      front of me. I remember on a similar train with a larger bag accidentally\n      hitting a man across the shins. I apologised immediately but he continued\n      to wince and rub his leg for the rest of the journey. Today my bag is\n      smaller, less obtrusive. My bag is no bigger than many others I see around\n      me. My bag is easily forgettable. My bag is like me. A man and a bag on a\n      train going nowhere important. That’s all anyone will see.";
    			t36 = space();
    			p14 = element("p");
    			p14.textContent = "A border is a line drawn but a line drawn can be changed. A border can be\n      changed. A difference can be changed. The difference between here and\n      there can be erased or revised by the erasure or revision of a border. The\n      definition of what is acceptable here and unacceptable there can be\n      redefined and redrawn like a border. A border has no meaning except for\n      that difference in meaning either side of it. A border is where someone\n      says no. A border is where a difference is applied. A border is where what\n      you do is not acceptable but what we do is.";
    			t38 = space();
    			p15 = element("p");
    			p15.textContent = "She’ll pass by many names keeping her own locked safely in a box. To me\n      she’s Jane but she doesn’t go by that name with anybody else. Every time\n      she hears one of her names on a street or across a room she has to know\n      where she is and who she is this time. She can’t afford to have her cover\n      blown by answering a name she hasn’t been called. One doubt. One question\n      and she’s dead.";
    			t40 = space();
    			p16 = element("p");
    			p16.textContent = "I look her work up afterwards to see if I get it right, if what I remember\n      is consistent with what she talks about and how she represents her work. I\n      will get it wrong. That is I listen to her speak and describe how she\n      works and what she is trying to do and I hear it in relation to this\n      piece. That is I have the germ of this piece in my head, a few scribbles\n      on pieces of paper I keep in my back pocket and swap from trousers to\n      trousers with a handkerchief as I add to them until I am ready to begin. I\n      hear her speak and watch her work on the screen and think of it in terms\n      of what is in my head. That means I will get it wrong. That means I will\n      misrepresent her and her work. That means I will regret that the event is\n      not recorded so at least there would be an accurate record of the artist\n      speaking that isn’t filtered through a different idea in my head.";
    			t42 = space();
    			p17 = element("p");
    			p17.textContent = "There’s no reply from her. I don’t expect one. We’re underground now\n      anyway. She knows when I’m due to arrive. At the final station I wheel my\n      bag up the ramp and out onto the street. At the top of the ramp I move in\n      beside a wall and check my phone. Still nothing from her. A few other\n      passengers pass me by. One walks in the direction I’m going while the\n      others turn right and wait at the pedestrian crossing. It’s about\n      watching. Waiting I can see if I’m being followed. Waiting I can see if\n      they’re on to me. Nothing. Nothing from them and nothing from her.";
    			t44 = space();
    			p18 = element("p");
    			p18.textContent = "She can only relax when she knows where she is. Enter a room, read a room,\n      watch. All the time watch without watching. Look without looking. Listen\n      without listening. Read without reading. All the time paying attention\n      without appearing to pay attention. All the time looking for that crack.\n      All the time looking for that one person with that one voice with that one\n      name looking for that one reaction that would blow her cover. Like the\n      time she was questioned in Buenos Aries. These were only casual questions.\n      These were only an effort to make conversation. These were just someone\n      trying to get to know her, maybe flirt a little, maybe ask her to dance or\n      have a drink. Innocent questions near the wrong ears. Innocent questions\n      near ears that shouldn’t have been listening to innocent questions.\n      Keeping her cover while answering innocent questions.";
    			t46 = space();
    			p19 = element("p");
    			p19.textContent = "Borders exist because of force. Borders exist because of agreement.\n      Borders exist because of consent. A border is a line around a place. A\n      border is a line around a people. A border is a line around a person. To\n      cross a border around a place or a people is to consent to what is\n      acceptable within that border. To cross a border is to be told that what\n      is acceptable elsewhere is not acceptable here.";
    			t48 = space();
    			p20 = element("p");
    			p20.textContent = "Her building is only a couple of minutes away. I should say nothing but I\n      message her again to say I’m at the station. I’m waiting for the all\n      clear. I’m waiting for her to say it’s safe to come up. I keep my head\n      down on the street. It’s too close and too late to have my cover blown\n      now. If they get me now they get us both. Still nothing from her. The\n      trick is to not stop now. The trick is to keep walking. The trick is to\n      make it look like my destination is still some way off. I pass her\n      building. If I look down one of the side streets I can see her door. If I\n      look up from her door I can see her window. I keep my head down. I keep\n      walking. I can walk around the block a few times until she says it’s safe,\n      until she’s ready for me to call. I guess the layout of the streets and\n      walk laps of her building, of her street. I glance behind me when I can to\n      check. Few people pass me. It’s a quiet day around this part of the city.";
    			t50 = space();
    			p21 = element("p");
    			p21.textContent = "A border is a list of instructions. A border is a list of instructions on\n      how to live. A border is a list of instructions on how to act. To cross a\n      border is to accept that you will comply with the list of instructions\n      that is the border. To cross a border while paying lip service to the\n      border, to the list of instructions, is to be a spy. To be a spy is to\n      recognise that a border exists but to refuse to act as the border\n      requires. To cross a border as a spy is to risk being found out. To cross\n      a border as a spy is to live with the fear that you will be exposed as a\n      spy. To be exposed as a spy is to pay a heavy price. To be exposed as a\n      spy is to be exposed as someone who refuses to live by the list of\n      instructions that the border supplies.";
    			t52 = space();
    			p22 = element("p");
    			p22.textContent = "Tamsin Norwood speaks about the point, the point of contact between a\n      stylus, a nib, and a page, between point and page. As she speaks a video\n      plays of one of her works. I will learn later it is called Keeping Time. I\n      will learn this while searching online to try to learn if what I remember\n      of the event and her work is accurate. The video shows the point of\n      contact between a pen and a page. The video follows the nib of the pen, of\n      two pens, or of one pen recorded twice, as it moves around a page, as it\n      makes a mark on the page. I watch the nib and the page. I watch the nib\n      moving around the page. I watch the mark it leaves on the page. I watch\n      what results from a nib and a page coming into contact.";
    			t54 = space();
    			p23 = element("p");
    			p23.textContent = "The day hasn’t really begun around here. I could try to find a small café\n      and sit, and wait. But my inconspicuous bag on the train could become a\n      conspicuous bag now. Avoid shops. Avoid cafes. Avoid bars. Just keep\n      walking. I pass a woman walking a dog. Has she passed me before? Think.\n      Has she? Did I notice the dog the first time around and not her? Fuck.\n      Stupid, beginner’s mistake. Watch. That’s the whole thing, watch without\n      being seen to watch. I turn a corner and pass a school. Make a note. Don’t\n      pass this way again. You can pass an office building, a row of shops or\n      apartments or houses, or anywhere else more than once. But you can’t pass\n      a school for a second time. Walking past a school again attracts\n      questions. A man passing a school again wheeling a bag attracts attention,\n      attracts questions. A man passing a school again is a fool and deserves to\n      have his cover blown.";
    			t56 = space();
    			p24 = element("p");
    			p24.textContent = "Borders exist within borders. A spy can live within a border and only\n      become a spy when they choose to disobey the list of instructions that the\n      border supplies. A spy can live their life without ever crossing the\n      border and becoming a spy. A spy does not have to act for anyone or\n      anything outside the border. A spy can be a spy for him or herself. A spy\n      does not have to be recruited. A spy does not have to be turned. A spy\n      does not have to be a spy on behalf of anyone else. A spy can choose to be\n      a spy for themselves and no one else. A border is a line made by man. A\n      border is a line made by woman. A spy can live within a border and choose\n      not to live as the border requires.";
    			t58 = space();
    			p25 = element("p");
    			p25.textContent = "I want to message her again, I want to pass her building and pass her\n      door, pass under her window. I want to look up as I pass under her window\n      and see her watching for me. I check my phone. I check my phone again. I\n      walk and I check my phone. It’s late. She’s late. I try to avoid walking\n      up and down the same streets but I’m conscious of not walking too far from\n      her place in case she messages me and tells me to come up. Behind her\n      building a main road skirts the river. I could sit on a bench and look at\n      the river. A man wheeling a bag sitting on a bench looking at the river\n      won’t attract any attention. I only see one bench; a woman is feeding a\n      young child. I walk past them.";
    			t60 = space();
    			p26 = element("p");
    			p26.textContent = "So easy to slip up. But she knows what she’s doing. She knows the game. It\n      becomes second nature for her to cover her tracks. It becomes second\n      nature to look over her shoulder without making it look like she’s looking\n      over her shoulder. It becomes second nature to check every street before\n      entering any door. Walking into a hotel or out of a bar. Putting on a hat\n      or adjusting a scarf. Fixing her gloves in the cold or fanning herself in\n      the heat. A nothing gesture by anybody else, an afterthought. Taking that\n      one small moment to look, to see, to watch.";
    			t62 = space();
    			p27 = element("p");
    			p27.textContent = "Without the nib touching the page there is nothing. That is there is a nib\n      and there is a page. But a nib is something that makes a mark and a page\n      is something that receives and records the mark of a nib. So is a nib a\n      nib if it isn’t touching a page? Is a page a page if there is nothing\n      making contact with it leaving a mark? Is a nib only a nib and a page only\n      a page when they come into contact? Is all we know of their existence the\n      record of what happens when the nib and the page come into contact?";
    			t64 = space();
    			p28 = element("p");
    			p28.textContent = "The list of instructions defined by a border can be more than the law. The\n      list of instructions defined by a border may never be written down. The\n      list of instructions defined by a border may require those living within\n      the border to live and act in a particular way different from those who\n      may live outside the border and those within the border will never be told\n      or never need to be told. The list of instructions provided by a border\n      can exist unwritten for generations and be followed by everyone within the\n      border automatically. The list of instructions provided by a border define\n      a way to act that complies with the wishes of the border. The list of\n      instructions provided by a border define a way to act that complies with\n      the wishes of the border as defined by those within the border who drew\n      the line to form the border.";
    			t66 = space();
    			p29 = element("p");
    			p29.textContent = "Did she get my message? Did she have to go out? Did something come up? Did\n      someone call? Can she answer my message? I picture someone calling and\n      taking up her time. I picture her trying to act normally and being polite\n      while the light flashes on her phone indicating my message. I picture her\n      trying to get her caller to leave, to find an excuse to check her phone\n      and message me to call later. I picture her trying to find a way to let me\n      know it’s not safe. I picture all the things that can go wrong but my\n      phone buzzes and she says to come up. At this point I just turn back on\n      myself. I don’t care. I have my phone in my hand so if I’m stopped, if I’m\n      questioned I can just say there’s been a change of plans and I have to go\n      in this direction instead of the other. I form a response to the question\n      but there’s no one there to ask me.";
    			t68 = space();
    			p30 = element("p");
    			p30.textContent = "When she walks she leaves no footprints. Nothing to say she was there.\n      Leaving every room is a meticulous operation. Checking out. Empty the\n      bathroom of every trace. Everything back in the bag. Everything in its\n      place. Leave nothing, forget nothing. No sign. No trace left behind. The\n      time she forgot a purse and panicked all the way to the airport. Relaxing\n      only when I went back to collect it. Remembering to give a different name.";
    			t70 = space();
    			p31 = element("p");
    			p31.textContent = "A border defines a way to act. A border defines a way to live. A border\n      defines what is the correct way to live and what is incorrect. A border is\n      nodding approval. A border is exposure and censure for those who\n      transgress the border. A border is ruin for those who transgress the\n      border. A spy lives within a border but chooses not to obey the border. A\n      spy does not ignore a border; to ignore a border is to risk exposure for\n      transgression of the border. A spy knows the border and respects the\n      border. A spy respects what a border can do. A spy lives his or her life\n      in constant awareness of the border. A spy lives his or her life in\n      constant awareness of what the border can do.";
    			t72 = space();
    			p32 = element("p");
    			p32.textContent = "If I’m spotted from a building, if I’m watched from a building it’s too\n      late anyway. If I’m recorded turning into the side street by the side of\n      her building it’s too late anyway. If someone is going to see me, if\n      someone is going to say or do anything it will be now. I approach her\n      door. I look up at her window. Even when I’m close enough I see nothing in\n      her window, nothing that isn’t in every other window. There’s a desk\n      inside the door of her building but it’s unmanned. Nobody there. Nobody in\n      the hallway. Nobody in the lift. Nobody in the corridor on her floor.\n      Looking left and right at her door. Knocking gently. Hearing nothing from\n      any of the doors I pass. Hearing nothing from the corridor behind or in\n      front of me. Hearing nothing but the lift moving on, up or down.";
    			t74 = space();
    			p33 = element("p");
    			p33.textContent = "Learning to contact her. Learning the dead letter drops. Learning the code\n      words. Learning the fake names and the real names. Learning to communicate\n      with a spy means learning to become a spy yourself. Learning to embrace\n      the game. Learning that if your cover is blown she will disappear to avoid\n      the risk of being blown herself. Learning to learn. Learning what you can\n      leave behind. Learning what is and isn’t important. Learning that it may\n      be important now but if it risks her cover being blown she will abandon it\n      without looking back. Learning that security is everything.";
    			t76 = space();
    			p34 = element("p");
    			p34.textContent = "A spy chooses to transgress a border because a spy chooses to live outside\n      of the list of instructions provided by a border. A spy learns quickly how\n      to act to avoid suspicion. A spy learns quickly or a spy is exposed. An\n      exposed spy is a lost spy. An exposed spy is a blown spy. A blown spy is\n      lost. A spy learns to live outwardly as if they respect and obey\n      everything that the border requires. A spy lives from safehouse to\n      safehouse. A safehouse is a space a spy defines that is inside a border\n      but outside the world of the border. A safehouse is defined by a line\n      drawn by a spy. A safehouse is defined by a border drawn by a spy. Within\n      the border of a safehouse a spy lives and acts as they choose.";
    			t78 = space();
    			p35 = element("p");
    			p35.textContent = "Hearing nothing but her singing. Hearing nothing but her undoing the chain\n      and the door opening. She’s singing gently as the door opens. She stands\n      behind the door as I step through so the first time I see her is when she\n      closes the door behind me. Seeing her in the dim light of the hallway and\n      putting my arms around her. First, gentle kiss. First gentle kiss of being\n      here. First gentle kiss of being safe.";
    			t80 = space();
    			p36 = element("p");
    			p36.textContent = "She gauges every story. What to tell and what not to tell. Which names to\n      change and which to leave in. Which names to just omit all together and\n      just tell a story about a friend. She knows how to tell any story in a way\n      that barely leaves any traces. She knows who she has told and what she has\n      told them. She knows who she has told and who she hasn’t. She knows how to\n      pick up different conversations at just the right point so they look like\n      the only conversations in the world.";
    			t82 = space();
    			p37 = element("p");
    			p37.textContent = "The door is the line we draw between us and the rest. The door is the line\n      we draw to say we are here and everything else is excluded. The door is\n      the border we close. The door is our border, meaning we and only we make\n      the laws here, we decide what is right and what is wrong. We decide how we\n      should act and we decide to exclude everyone else who says otherwise.";
    			t84 = space();
    			p38 = element("p");
    			p38.textContent = "I think about borders. I think about boundaries. I think about edges. I\n      think about the idea that things only come into existence when they come\n      into contact with another. I follow the nib moving over the page leaving\n      its mark and I see the mark as the only record of its existence. At one\n      point Tamasin Norwood describes taking a pen and marking a border around\n      the inside of a house she and her husband had just vacated because they\n      were moving somewhere else. I don’t know if she means to mention this\n      event as part of her talk or just chooses to include it as an anecdote\n      supporting her overall fascination with the point of contact between a nib\n      and a page. By drawing a line she is drawing a border. By drawing a border\n      around the interior of every room is she creating the room? By drawing a\n      border is she describing that this room, this house, is now different from\n      what is outside the border? By drawing this line, this border, is what is\n      inside this border something else? By drawing this border is she saying\n      that this house was not a house, it was a home? By drawing this border is\n      she saying that this house is now different from all the other houses\n      outside the border because they are just houses and this was a home?";
    			t86 = space();
    			p39 = element("p");
    			p39.textContent = "Checking herself when she crosses a border she files away anything she\n      won’t need, any stories she won’t need. Every spy operates in a cell of\n      their own. Every spy operates without wires. Every spy has a safehouse.\n      Knowing what to leave in a safehouse and what to leave elsewhere. Knowing\n      who to tell about the safehouse and who to never let know it even exists.\n      Looking at a face and deciding in an instant how much to tell them.\n      Looking at a face and deciding in an instant that they will learn nothing.\n      Taking a circuitous route back to the safehouse. Making it look like there\n      is no safehouse. Allowing me into the safehouse.";
    			t88 = space();
    			p40 = element("p");
    			p40.textContent = "I tell stories. She sings. I put on some music and we dance. We kiss. She\n      makes a meal. I watch and offer to help. We sit on the couch in each\n      other’s arms. We watch the day darken and end outside. We draw the\n      curtains before turning on a light. She tells me stories. We kiss. Share\n      the bathroom washing our teeth. We have drawn our border and now this\n      place is our country, our land. These rooms are our empire. The door with\n      the chain drawn is our border we’ve closed. We touch as we pass cleaning\n      up glasses and rinsing plates. We undress and slip beneath the covers. We\n      decree that it is too cold outside of the bed for either of us to leave.\n      This is our country and these are our laws. The line we have drawn is the\n      only line that matters. We make love and feed off the heat of each other.\n      Behind our closed border the only currency is the heat of our bodies. The\n      only language is touch and kiss.";
    			t90 = space();
    			p41 = element("p");
    			p41.textContent = "I know I could be getting her work very wrong. I know if I ask her and\n      suggest what I think as I listen to her speak and watch the video of her\n      work and consider her story that I could be getting everything wrong, very\n      wrong. I know this and I know that by asking her she will explain where I\n      am going wrong. But as I choose to not talk to her in the pub after the\n      event, as I choose not to ask her I know I will probably never know. So I\n      will keep my wrongness, in whatever shape it may be.";
    			t92 = space();
    			p42 = element("p");
    			p42.textContent = "Knowing what is out there about her. Making sure she leaves no traces. No\n      breadcrumbs to follow. Like the time, horse riding in the hills above the\n      city. Pretending to the guide that phones had been forgotten and left back\n      in the car so she couldn’t take a photograph. Knowing just what to say to\n      make sure she leaves no footprints. Knowing how cautious she has to be\n      because she knows what will happen if she gets caught. She knows the\n      penalty for being a spy. She knows the price she would pay. Knowing the\n      risk. Knowing the reward. She is a spy but she crosses the border for me.";
    			t94 = space();
    			p43 = element("p");
    			p43.textContent = "The enemy of every border is time. Time erodes and erases borders. Borders\n      that stand for millennia disappear in an instant. Borders that stand and\n      repel invaders for generations eventually fall over nothing. The enemy is\n      time. We make love in the morning to feed our border. We eat breakfast and\n      shower and return to bed to make love to keep our border intact. But time\n      is the enemy. Time is the enemy and our border cannot hold. Time is the\n      enemy and our border crumbles and I have to go.";
    			t96 = space();
    			p44 = element("p");
    			p44.textContent = "The door is just a door now. The chain is just a chain. The corridor\n      outside is the same corridor as it was before it was a border post. We\n      kiss before I pass through the door, we kiss before I cross what is left\n      of the border. We kiss and I promise to message her as soon as I get home.\n      We kiss and we already make plans to declare our own country again. There\n      will be walls. There will be dogs and searchlights. There will be other\n      borders to cross and lies to keep. There will be codes and secret\n      messages, checking for watchers and disappearing in plain sight. But we\n      will draw our line. We will make our border again and stake out our own\n      land. We will close a door and seal it with a line and ward off the world.";
    			attr_dev(h1, "class", "svelte-odwcow");
    			add_location(h1, file$8, 14, 4, 380);
    			attr_dev(h2, "class", "svelte-odwcow");
    			add_location(h2, file$8, 15, 4, 403);
    			attr_dev(header, "class", "svelte-odwcow");
    			add_location(header, file$8, 13, 2, 367);
    			attr_dev(button0, "class", "svelte-odwcow");
    			add_location(button0, file$8, 19, 4, 470);
    			attr_dev(button1, "class", "svelte-odwcow");
    			add_location(button1, file$8, 20, 4, 544);
    			attr_dev(div0, "class", "text-options svelte-odwcow");
    			add_location(div0, file$8, 18, 2, 439);
    			add_location(p0, file$8, 30, 4, 777);
    			add_location(p1, file$8, 37, 4, 1121);
    			add_location(p2, file$8, 49, 4, 1867);
    			add_location(p3, file$8, 58, 4, 2411);
    			add_location(p4, file$8, 67, 4, 2938);
    			add_location(p5, file$8, 77, 4, 3528);
    			add_location(p6, file$8, 91, 4, 4435);
    			add_location(p7, file$8, 97, 4, 4756);
    			add_location(p8, file$8, 110, 4, 5586);
    			add_location(p9, file$8, 123, 4, 6424);
    			add_location(p10, file$8, 132, 4, 6951);
    			add_location(p11, file$8, 143, 4, 7620);
    			add_location(p12, file$8, 155, 4, 8424);
    			add_location(p13, file$8, 171, 4, 9525);
    			add_location(p14, file$8, 184, 4, 10389);
    			add_location(p15, file$8, 194, 4, 11004);
    			add_location(p16, file$8, 202, 4, 11438);
    			add_location(p17, file$8, 216, 4, 12393);
    			add_location(p18, file$8, 226, 4, 13020);
    			add_location(p19, file$8, 240, 4, 13964);
    			add_location(p20, file$8, 248, 4, 14417);
    			add_location(p21, file$8, 263, 4, 15448);
    			add_location(p22, file$8, 276, 4, 16282);
    			add_location(p23, file$8, 288, 4, 17067);
    			add_location(p24, file$8, 303, 4, 18051);
    			add_location(p25, file$8, 315, 4, 18812);
    			add_location(p26, file$8, 327, 4, 19573);
    			add_location(p27, file$8, 337, 4, 20196);
    			add_location(p28, file$8, 346, 4, 20762);
    			add_location(p29, file$8, 360, 4, 21684);
    			add_location(p30, file$8, 374, 4, 22615);
    			add_location(p31, file$8, 382, 4, 23102);
    			add_location(p32, file$8, 394, 4, 23863);
    			add_location(p33, file$8, 407, 4, 24730);
    			add_location(p34, file$8, 417, 4, 25374);
    			add_location(p35, file$8, 429, 4, 26157);
    			add_location(p36, file$8, 437, 4, 26620);
    			add_location(p37, file$8, 446, 4, 27161);
    			add_location(p38, file$8, 453, 4, 27573);
    			add_location(p39, file$8, 472, 4, 28925);
    			add_location(p40, file$8, 483, 4, 29626);
    			add_location(p41, file$8, 498, 4, 30623);
    			add_location(p42, file$8, 507, 4, 31174);
    			add_location(p43, file$8, 517, 4, 31822);
    			add_location(p44, file$8, 526, 4, 32372);
    			attr_dev(div1, "class", "text");
    			add_location(div1, file$8, 29, 2, 754);
    			attr_dev(div2, "class", "text-wrapper");
    			add_location(div2, file$8, 8, 0, 199);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, header);
    			append_dev(header, h1);
    			append_dev(header, t1);
    			append_dev(header, h2);
    			append_dev(div2, t3);
    			append_dev(div2, div0);
    			append_dev(div0, button0);
    			append_dev(div0, t5);
    			append_dev(div0, button1);
    			append_dev(div2, t7);
    			mount_component(audioplayer, div2, null);
    			append_dev(div2, t8);
    			append_dev(div2, div1);
    			append_dev(div1, p0);
    			append_dev(div1, t10);
    			append_dev(div1, p1);
    			append_dev(div1, t12);
    			append_dev(div1, p2);
    			append_dev(div1, t14);
    			append_dev(div1, p3);
    			append_dev(div1, t16);
    			append_dev(div1, p4);
    			append_dev(div1, t18);
    			append_dev(div1, p5);
    			append_dev(div1, t20);
    			append_dev(div1, p6);
    			append_dev(div1, t22);
    			append_dev(div1, p7);
    			append_dev(div1, t24);
    			append_dev(div1, p8);
    			append_dev(div1, t26);
    			append_dev(div1, p9);
    			append_dev(div1, t28);
    			append_dev(div1, p10);
    			append_dev(div1, t30);
    			append_dev(div1, p11);
    			append_dev(div1, t32);
    			append_dev(div1, p12);
    			append_dev(div1, t34);
    			append_dev(div1, p13);
    			append_dev(div1, t36);
    			append_dev(div1, p14);
    			append_dev(div1, t38);
    			append_dev(div1, p15);
    			append_dev(div1, t40);
    			append_dev(div1, p16);
    			append_dev(div1, t42);
    			append_dev(div1, p17);
    			append_dev(div1, t44);
    			append_dev(div1, p18);
    			append_dev(div1, t46);
    			append_dev(div1, p19);
    			append_dev(div1, t48);
    			append_dev(div1, p20);
    			append_dev(div1, t50);
    			append_dev(div1, p21);
    			append_dev(div1, t52);
    			append_dev(div1, p22);
    			append_dev(div1, t54);
    			append_dev(div1, p23);
    			append_dev(div1, t56);
    			append_dev(div1, p24);
    			append_dev(div1, t58);
    			append_dev(div1, p25);
    			append_dev(div1, t60);
    			append_dev(div1, p26);
    			append_dev(div1, t62);
    			append_dev(div1, p27);
    			append_dev(div1, t64);
    			append_dev(div1, p28);
    			append_dev(div1, t66);
    			append_dev(div1, p29);
    			append_dev(div1, t68);
    			append_dev(div1, p30);
    			append_dev(div1, t70);
    			append_dev(div1, p31);
    			append_dev(div1, t72);
    			append_dev(div1, p32);
    			append_dev(div1, t74);
    			append_dev(div1, p33);
    			append_dev(div1, t76);
    			append_dev(div1, p34);
    			append_dev(div1, t78);
    			append_dev(div1, p35);
    			append_dev(div1, t80);
    			append_dev(div1, p36);
    			append_dev(div1, t82);
    			append_dev(div1, p37);
    			append_dev(div1, t84);
    			append_dev(div1, p38);
    			append_dev(div1, t86);
    			append_dev(div1, p39);
    			append_dev(div1, t88);
    			append_dev(div1, p40);
    			append_dev(div1, t90);
    			append_dev(div1, p41);
    			append_dev(div1, t92);
    			append_dev(div1, p42);
    			append_dev(div1, t94);
    			append_dev(div1, p43);
    			append_dev(div1, t96);
    			append_dev(div1, p44);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*click_handler*/ ctx[1], false, false, false),
    					listen_dev(button1, "click", /*click_handler_1*/ ctx[2], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			const audioplayer_changes = {};
    			if (dirty & /*audioActive*/ 1) audioplayer_changes.active = /*audioActive*/ ctx[0];
    			audioplayer.$set(audioplayer_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
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
    			if (detaching) detach_dev(div2);
    			destroy_component(audioplayer);
    			if (detaching && div2_outro) div2_outro.end();
    			mounted = false;
    			run_all(dispose);
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
    	validate_slots("Butterfly", slots, []);
    	let audioActive = false;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Butterfly> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => $$invalidate(0, audioActive = !audioActive);
    	const click_handler_1 = () => window.print();
    	$$self.$capture_state = () => ({ blur, linear: identity, AudioPlayer, audioActive });

    	$$self.$inject_state = $$props => {
    		if ("audioActive" in $$props) $$invalidate(0, audioActive = $$props.audioActive);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [audioActive, click_handler, click_handler_1];
    }

    class Butterfly extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Butterfly",
    			options,
    			id: create_fragment$a.name
    		});
    	}
    }

    /* src/routes/pieces/OnlyJust.svelte generated by Svelte v3.32.3 */
    const file$9 = "src/routes/pieces/OnlyJust.svelte";

    function create_fragment$b(ctx) {
    	let div;
    	let p0;
    	let t1;
    	let p1;
    	let t3;
    	let p2;
    	let t5;
    	let p3;
    	let t7;
    	let p4;
    	let t9;
    	let p5;
    	let t11;
    	let p6;
    	let t13;
    	let p7;
    	let t15;
    	let p8;
    	let t17;
    	let p9;
    	let t19;
    	let p10;
    	let t21;
    	let p11;
    	let t23;
    	let p12;
    	let t25;
    	let p13;
    	let t27;
    	let p14;
    	let t29;
    	let p15;
    	let t31;
    	let p16;
    	let t33;
    	let p17;
    	let t35;
    	let p18;
    	let t37;
    	let p19;
    	let t39;
    	let p20;
    	let t41;
    	let p21;
    	let t43;
    	let p22;
    	let t45;
    	let p23;
    	let t47;
    	let p24;
    	let t49;
    	let p25;
    	let t51;
    	let p26;
    	let t53;
    	let p27;
    	let t55;
    	let p28;
    	let t57;
    	let p29;
    	let t59;
    	let p30;
    	let t61;
    	let p31;
    	let t63;
    	let p32;
    	let t65;
    	let p33;
    	let t67;
    	let p34;
    	let t69;
    	let p35;
    	let t71;
    	let p36;
    	let t73;
    	let p37;
    	let t75;
    	let p38;
    	let t77;
    	let p39;
    	let t79;
    	let p40;
    	let t81;
    	let p41;
    	let t83;
    	let p42;
    	let t85;
    	let p43;
    	let t87;
    	let p44;
    	let t89;
    	let p45;
    	let t91;
    	let p46;
    	let t93;
    	let p47;
    	let t95;
    	let p48;
    	let t97;
    	let p49;
    	let t99;
    	let p50;
    	let t101;
    	let p51;
    	let t103;
    	let p52;
    	let t105;
    	let p53;
    	let t107;
    	let p54;
    	let t109;
    	let p55;
    	let t111;
    	let p56;
    	let t113;
    	let p57;
    	let t115;
    	let p58;
    	let t117;
    	let p59;
    	let t119;
    	let p60;
    	let t121;
    	let p61;
    	let t123;
    	let p62;
    	let t125;
    	let p63;
    	let t127;
    	let p64;
    	let t129;
    	let p65;
    	let t131;
    	let p66;
    	let t133;
    	let p67;
    	let t135;
    	let p68;
    	let t137;
    	let p69;
    	let t139;
    	let p70;
    	let t141;
    	let p71;
    	let t143;
    	let p72;
    	let t145;
    	let p73;
    	let t147;
    	let p74;
    	let t149;
    	let p75;
    	let t151;
    	let p76;
    	let t153;
    	let p77;
    	let t155;
    	let p78;
    	let t157;
    	let p79;
    	let t159;
    	let p80;
    	let t161;
    	let p81;
    	let t163;
    	let p82;
    	let t165;
    	let p83;
    	let t167;
    	let p84;
    	let t169;
    	let p85;
    	let t171;
    	let p86;
    	let t173;
    	let p87;
    	let t175;
    	let p88;
    	let t177;
    	let p89;
    	let t179;
    	let p90;
    	let t181;
    	let p91;
    	let t183;
    	let p92;
    	let t185;
    	let p93;
    	let t187;
    	let p94;
    	let t189;
    	let p95;
    	let t191;
    	let p96;
    	let t193;
    	let p97;
    	let t195;
    	let p98;
    	let t197;
    	let p99;
    	let t199;
    	let p100;
    	let t201;
    	let p101;
    	let t203;
    	let p102;
    	let t205;
    	let p103;
    	let t207;
    	let p104;
    	let t209;
    	let p105;
    	let t211;
    	let p106;
    	let t213;
    	let p107;
    	let t215;
    	let p108;
    	let t217;
    	let p109;
    	let t219;
    	let p110;
    	let t221;
    	let p111;
    	let t223;
    	let p112;
    	let t225;
    	let p113;
    	let t227;
    	let p114;
    	let t229;
    	let p115;
    	let t231;
    	let p116;
    	let div_intro;
    	let div_outro;
    	let current;

    	const block = {
    		c: function create() {
    			div = element("div");
    			p0 = element("p");
    			p0.textContent = "Ͼ";
    			t1 = space();
    			p1 = element("p");
    			p1.textContent = "I look around my flat and I see boxes, dozens of boxes";
    			t3 = space();
    			p2 = element("p");
    			p2.textContent = "Ϸ";
    			t5 = space();
    			p3 = element("p");
    			p3.textContent = "The first morning of the world is brilliant and sparkly, dazzled by its own\n    newness. All of creation awaits their naming. A hush falls – the bated\n    breath of the divine – and a box is opened. From it emerge cacophonous\n    sounds: of a storm, or a stirred hornet’s nest, of chaos and catastrophe.\n    With that first peek into unforeseeable contents, the infancy of humanity\n    ceases";
    			t7 = space();
    			p4 = element("p");
    			p4.textContent = "ϧ";
    			t9 = space();
    			p5 = element("p");
    			p5.textContent = "Adventurers leave their homes, which made them, to find these unmapped\n    places and face dragons and monsters – they face their own fear";
    			t11 = space();
    			p6 = element("p");
    			p6.textContent = "Ϣ";
    			t13 = space();
    			p7 = element("p");
    			p7.textContent = "I had Pandora in my head so I started to wonder if she had a box. And if she\n    did what colour it might be. I decided pink like her cardigan. And gave it\n    flaps";
    			t15 = space();
    			p8 = element("p");
    			p8.textContent = "Ϙ";
    			t17 = space();
    			p9 = element("p");
    			p9.textContent = "God knows why, but a whirlwind of purple smoke engulfing a landscape which\n    settles over everything – grassland, houses and hills";
    			t19 = space();
    			p10 = element("p");
    			p10.textContent = "Φ";
    			t21 = space();
    			p11 = element("p");
    			p11.textContent = "I remember the first time I heard the term Pandora’s Box, I was pretty\n    young, and someone, I can’t remember who now, said it to me sort of vaguely,\n    we were both standing on a log in the countryside somewhere";
    			t23 = space();
    			p12 = element("p");
    			p12.textContent = "Ϸ";
    			t25 = space();
    			p13 = element("p");
    			p13.textContent = "Who opened the box, releasing negative forces into the world?";
    			t27 = space();
    			p14 = element("p");
    			p14.textContent = "Ϯ";
    			t29 = space();
    			p15 = element("p");
    			p15.textContent = "It’s the Ark of Covenant stored away in a warehouse. It’s in the box at the\n    very back of the top of the wardrobe in your parent’s bedroom. It’s what\n    Freud would say about that. It’s Tutankhamun’s tomb. It’s a bunker in\n    Switzerland";
    			t31 = space();
    			p16 = element("p");
    			p16.textContent = "ω";
    			t33 = space();
    			p17 = element("p");
    			p17.textContent = "All the gifts Zeus never wanted, he put in the box he gave to you Along with\n    the blame passed on to you, the woman, created for the task, by a male\n    pantheon";
    			t35 = space();
    			p18 = element("p");
    			p18.textContent = "ͽ";
    			t37 = space();
    			p19 = element("p");
    			p19.textContent = "Some things you should not look at because they ruin your happiness";
    			t39 = space();
    			p20 = element("p");
    			p20.textContent = "π";
    			t41 = space();
    			p21 = element("p");
    			p21.textContent = "And that’s what it is isn’t it? Another of these classic myths that through\n    the centuries of sexism boils down to ‘curious lady dooms humanity’. Cursed\n    be she who questions the imposed order even if it doesn’t really make a lick\n    of sense";
    			t43 = space();
    			p22 = element("p");
    			p22.textContent = "α";
    			t45 = space();
    			p23 = element("p");
    			p23.textContent = "Pandora, Cassandra, Jocasta, Medea. We know them but we don’t know how we\n    know them. But we intuit that somehow they are bad…else their names would\n    not still live";
    			t47 = space();
    			p24 = element("p");
    			p24.textContent = "Ж";
    			t49 = space();
    			p25 = element("p");
    			p25.textContent = "I am not familiar with the myth I am aware that Pandora was depicted as a\n    beautiful woman. I learned this from reading The Beauty Myth by Naomi Wolf";
    			t51 = space();
    			p26 = element("p");
    			p26.textContent = "Ђ";
    			t53 = space();
    			p27 = element("p");
    			p27.textContent = "I’d like to associate that box with the hope that Pandora finds at the\n    bottom of the box once all the rage and jealousy and disease has made its\n    escape Ϯ My question is, why was this box so easily opened in the first\n    place? It seems to be a bit of a setup. If you want to keep your afflictions\n    locked up, perhaps it’s better to find something less accessible? Ќ It\n    evokes memories of the imagination that I had, for I believed that the box\n    contained pretty jewels and things of great Beauty, that Pandora could\n    perhaps open the box and find whatever she was looking for, anything at all";
    			t55 = space();
    			p28 = element("p");
    			p28.textContent = "Ђ";
    			t57 = space();
    			p29 = element("p");
    			p29.textContent = "Pandora’s box has a magical quality and always has had from when I was a\n    child";
    			t59 = space();
    			p30 = element("p");
    			p30.textContent = "Φ";
    			t61 = space();
    			p31 = element("p");
    			p31.textContent = "I always found something about the words Pandora’s box a bit irritating,\n    maybe I don’t like the name Pandora, or else I’m irritated by the vagueness\n    of the possibilities of what it means";
    			t63 = space();
    			p32 = element("p");
    			p32.textContent = "Ж";
    			t65 = space();
    			p33 = element("p");
    			p33.textContent = "I remember when I read that book thinking, why is it always women who are\n    depicted as wreaking disaster – Eve in the bible for instance – when in fact\n    decisions made by men have caused more sorrow and pain to humanity than\n    women α When she opens her legs – annihilation";
    			t67 = space();
    			p34 = element("p");
    			p34.textContent = "Ϗ";
    			t69 = space();
    			p35 = element("p");
    			p35.textContent = "I used to wish that I could fix all problems and it took the form of a pair\n    of trousers with a huge pocket in which there were tools and literally\n    anything that someone else needed – to make them happy – and that I could do\n    this. I didn’t call them my Pandora Pantalones but they could have been that";
    			t71 = space();
    			p36 = element("p");
    			p36.textContent = "Ϩ";
    			t73 = space();
    			p37 = element("p");
    			p37.textContent = "When I think of Pandora’s Box I don’t think of the myth, I think of the\n    iconic silent film from the 1920s. In my mind’s eye I see Lulu peering out\n    from her monochrome screen world";
    			t75 = space();
    			p38 = element("p");
    			p38.textContent = "Ϭ";
    			t77 = space();
    			p39 = element("p");
    			p39.textContent = "A disruption in the façade of the normal";
    			t79 = space();
    			p40 = element("p");
    			p40.textContent = "Ͼ";
    			t81 = space();
    			p41 = element("p");
    			p41.textContent = "Berlin, Mexico City, London";
    			t83 = space();
    			p42 = element("p");
    			p42.textContent = "Ќ";
    			t85 = space();
    			p43 = element("p");
    			p43.textContent = "A Myth to my young mind was little more than a fairy story, a story which I\n    changed to make me feel happy whenever I thought about it";
    			t87 = space();
    			p44 = element("p");
    			p44.textContent = "ω";
    			t89 = space();
    			p45 = element("p");
    			p45.textContent = "Horrors, nightmares, plagues, curses, tempests, pestilence, war, disasters ϧ\n    The transmission of wisdom";
    			t91 = space();
    			p46 = element("p");
    			p46.textContent = "Ϯ";
    			t93 = space();
    			p47 = element("p");
    			p47.textContent = "Choose the right container, casket, trunk, suitcase, coffin, urn, lunchbox,\n    envelope, package, shipping container, safety deposit box, pocket, safe\n    plagues, curses, tempests, huge pocket";
    			t95 = space();
    			p48 = element("p");
    			p48.textContent = "Ϩ";
    			t97 = space();
    			p49 = element("p");
    			p49.textContent = "She is disarmingly naive when she’s not being entirely calculating";
    			t99 = space();
    			p50 = element("p");
    			p50.textContent = "Ϗ";
    			t101 = space();
    			p51 = element("p");
    			p51.textContent = "I know, but only just, that the box is meant to spill out problems";
    			t103 = space();
    			p52 = element("p");
    			p52.textContent = "ͽ";
    			t105 = space();
    			p53 = element("p");
    			p53.textContent = "My daughter Emer when asked about Pandora’s Box told me it is an online shop\n    where she buys very pretty jewellery";
    			t107 = space();
    			p54 = element("p");
    			p54.textContent = "α";
    			t109 = space();
    			p55 = element("p");
    			p55.textContent = "For me the whiff of evil power associated with Pandora still sticks to those\n    bracelets even though they are marketed as the exact opposite – girlie,\n    desirable, collectable. I like when I catch a glimpse of one on the wrist of\n    my niece. Hahaha, I think, you’re out of your box!";
    			t111 = space();
    			p56 = element("p");
    			p56.textContent = "Φ";
    			t113 = space();
    			p57 = element("p");
    			p57.textContent = "I wonder about Pandora, who she was, was she young or old, and just what she\n    opened up for herself and the world. I wonder whether she was punished for\n    opening the box, or did she thrive from the wonders and lessons that the box\n    opened, were they positive or negative lessons? Was she sorry she opened it?";
    			t115 = space();
    			p58 = element("p");
    			p58.textContent = "Ϩ";
    			t117 = space();
    			p59 = element("p");
    			p59.textContent = "Lulu is a simmering, smoldering, sexy, celluloid, screen siren. She is the\n    embodiment of 1920s glamour with her slinky black bob, flashing eyes and\n    carefree smile. But Lulu is a world of trouble";
    			t119 = space();
    			p60 = element("p");
    			p60.textContent = "Д";
    			t121 = space();
    			p61 = element("p");
    			p61.textContent = "Pandora is misunderstood and it’s not Pandora’s shop on Shop Street as my\n    husband thinks";
    			t123 = space();
    			p62 = element("p");
    			p62.textContent = "Ϣ";
    			t125 = space();
    			p63 = element("p");
    			p63.textContent = "As silky as a slinky snake She won’t be boxed In the next frame, she is home\n    feet up, tea cupped, in a soothing ritual of rest";
    			t127 = space();
    			p64 = element("p");
    			p64.textContent = "Ϩ";
    			t129 = space();
    			p65 = element("p");
    			p65.textContent = "Men lose their minds, their willpower, their morals when they are around her";
    			t131 = space();
    			p66 = element("p");
    			p66.textContent = "Ϯ";
    			t133 = space();
    			p67 = element("p");
    			p67.textContent = "If you find you don’t care for this binary, could you accept that we already\n    contain everything?";
    			t135 = space();
    			p68 = element("p");
    			p68.textContent = "Д";
    			t137 = space();
    			p69 = element("p");
    			p69.textContent = "She is the rebellious disobedient one and someone to fear. She looked at her\n    lovers head on you see. You look at her when she enters a room π I think an\n    apt update would be lazy entitled bigoted man doesn’t just open the box – he\n    has the power to close it but chooses not to because it might slightly\n    inconvenience him and besides – I mean – couldn’t he use all the chaos\n    caused by these plagues or scourges or whatever to his own benefit?";
    			t139 = space();
    			p70 = element("p");
    			p70.textContent = "ϧ";
    			t141 = space();
    			p71 = element("p");
    			p71.textContent = "Pandora’s box immediately makes me think of opening the door of a strange\n    dark room";
    			t143 = space();
    			p72 = element("p");
    			p72.textContent = "Ϙ";
    			t145 = space();
    			p73 = element("p");
    			p73.textContent = "A feeling of anticipation, excitement and wonder of the power within. A\n    temptation with a fear of something prohibited and irreversible";
    			t147 = space();
    			p74 = element("p");
    			p74.textContent = "Ͼ";
    			t149 = space();
    			p75 = element("p");
    			p75.textContent = "You could say these unopened boxes are the ‘what ifs’ in my life. An\n    arrangement of ‘what ifs’ arising from a fear of not being able to return\n    the contents to their place. And so I keep them tightly shut, carrying them\n    from home to home, unopened boxes multiplying on the coffee table";
    			t151 = space();
    			p76 = element("p");
    			p76.textContent = "Φ";
    			t153 = space();
    			p77 = element("p");
    			p77.textContent = "There was a very particular time in my life when the description opening\n    Pandora’s box fits perfectly. I’m not sure if there is an adequate word to\n    describe the profound experiences that opened up and I was absolutely\n    unready for. I longed to return back to the time before it all kicked off,\n    but I couldn’t, and I’ll never forget the moment that I realised that I\n    could never go back to the way I was before";
    			t155 = space();
    			p78 = element("p");
    			p78.textContent = "ϧ";
    			t157 = space();
    			p79 = element("p");
    			p79.textContent = "This analogy of the dark room, uncertain ground, is something I have used to\n    describe what it’s like to venture into a new part of my psyche or emotional\n    being, testing out new areas of feeling which are not straightforward or\n    pleasant – it can be frightening, like looking into the abyss";
    			t159 = space();
    			p80 = element("p");
    			p80.textContent = "Ќ";
    			t161 = space();
    			p81 = element("p");
    			p81.textContent = "I was eventually to find out that my version belied the Myth surrounding\n    Pandora’s box, I found this entirely unsatisfactory";
    			t163 = space();
    			p82 = element("p");
    			p82.textContent = "ϧ";
    			t165 = space();
    			p83 = element("p");
    			p83.textContent = "Without risk, there is no growth";
    			t167 = space();
    			p84 = element("p");
    			p84.textContent = "Φ";
    			t169 = space();
    			p85 = element("p");
    			p85.textContent = "The lessons have been incredibly deep and profound and have changed me\n    forever";
    			t171 = space();
    			p86 = element("p");
    			p86.textContent = "π";
    			t173 = space();
    			p87 = element("p");
    			p87.textContent = "Stop crying about it already and find the silver lining to the mounting pile\n    of corpses";
    			t175 = space();
    			p88 = element("p");
    			p88.textContent = "α";
    			t177 = space();
    			p89 = element("p");
    			p89.textContent = "And of course that box in its crudest clearest sense is her vagina";
    			t179 = space();
    			p90 = element("p");
    			p90.textContent = "Ϭ";
    			t181 = space();
    			p91 = element("p");
    			p91.textContent = "Some try and go back to where it was before the disruption, some flow and\n    thrive and are able to co-create a better world, others get stuck in\n    sadness, depression and doom multiplying on the coffee table silver lining";
    			t183 = space();
    			p92 = element("p");
    			p92.textContent = "Ϯ";
    			t185 = space();
    			p93 = element("p");
    			p93.textContent = "OOppeenn aanndd cclloosseedd aarree ooppppoossiitteess,, bbuutt mmaayybbee\n    tthheeyy ddoonn’’tt nneeeedd ttoo bbee";
    			t187 = space();
    			p94 = element("p");
    			p94.textContent = "Д";
    			t189 = space();
    			p95 = element("p");
    			p95.textContent = "I fear to let go of the tight grip I have on multiple locked vessels within\n    me. A woman is not allowed to become hysterical. Keep a lid on it and all\n    that";
    			t191 = space();
    			p96 = element("p");
    			p96.textContent = "Φ";
    			t193 = space();
    			p97 = element("p");
    			p97.textContent = "An opening up of something that cannot be put back to the way it was before,\n    but an opening up of what? Something tremendous most likely, layers upon\n    layers of new energies, experiences and emotions that perhaps we weren’t\n    ready for";
    			t195 = space();
    			p98 = element("p");
    			p98.textContent = "Ϯ";
    			t197 = space();
    			p99 = element("p");
    			p99.textContent = "Is that the doorbell? If it’s your bad news letter, don’t open it. It’s in\n    an email about the SECRET of how to lower your blood sugar. It’s in a vial\n    in a lab, quivering. Put a lid on it. This message seems dangerous. It’s\n    buried treasure. Similar messages were used to steal people’s personal\n    information. Is there truly a difference between inside and outside?";
    			t199 = space();
    			p100 = element("p");
    			p100.textContent = "Ϸ";
    			t201 = space();
    			p101 = element("p");
    			p101.textContent = "With Pandora’s act, layers of complexity are added to the world. Human\n    becoming is initiated by the loss of innocence; the contours of the self are\n    known not just through love and joy, but also through suffering and illness";
    			t203 = space();
    			p102 = element("p");
    			p102.textContent = "ϧ";
    			t205 = space();
    			p103 = element("p");
    			p103.textContent = "The unknown box is also the knower and the process of knowing";
    			t207 = space();
    			p104 = element("p");
    			p104.textContent = "Ͼ";
    			t209 = space();
    			p105 = element("p");
    			p105.textContent = "I bought it for fifteen pounds from an antiquarian in Camden passage";
    			t211 = space();
    			p106 = element("p");
    			p106.textContent = "Ϫ";
    			t213 = space();
    			p107 = element("p");
    			p107.textContent = "Pandora keeps nothing in her box at all. It is full of the imagination and\n    projections of others";
    			t215 = space();
    			p108 = element("p");
    			p108.textContent = "Д";
    			t217 = space();
    			p109 = element("p");
    			p109.textContent = "She lives within me";
    			t219 = space();
    			p110 = element("p");
    			p110.textContent = "Ϣ";
    			t221 = space();
    			p111 = element("p");
    			p111.textContent = "Don’t shoot the messenger";
    			t223 = space();
    			p112 = element("p");
    			p112.textContent = "Ϭ";
    			t225 = space();
    			p113 = element("p");
    			p113.textContent = "Shines a light";
    			t227 = space();
    			p114 = element("p");
    			p114.textContent = "Ͼ";
    			t229 = space();
    			p115 = element("p");
    			p115.textContent = "(some are gifts from my mother)";
    			t231 = space();
    			p116 = element("p");
    			p116.textContent = "Ͼ Ϸ ϧ Ϣ Ϙ Φ Ϯ ω ͽ π α Ж Ђ Ќ Ϗ Ϩ Ϭ Д Ϫ";
    			attr_dev(p0, "class", "svelte-1u56nyg");
    			add_location(p0, file$9, 10, 2, 269);
    			attr_dev(p1, "class", "svelte-1u56nyg");
    			add_location(p1, file$9, 11, 2, 280);
    			attr_dev(p2, "class", "svelte-1u56nyg");
    			add_location(p2, file$9, 12, 2, 344);
    			attr_dev(p3, "class", "svelte-1u56nyg");
    			add_location(p3, file$9, 13, 2, 355);
    			attr_dev(p4, "class", "svelte-1u56nyg");
    			add_location(p4, file$9, 21, 2, 765);
    			attr_dev(p5, "class", "svelte-1u56nyg");
    			add_location(p5, file$9, 22, 2, 776);
    			attr_dev(p6, "class", "svelte-1u56nyg");
    			add_location(p6, file$9, 26, 2, 932);
    			attr_dev(p7, "class", "svelte-1u56nyg");
    			add_location(p7, file$9, 27, 2, 943);
    			attr_dev(p8, "class", "svelte-1u56nyg");
    			add_location(p8, file$9, 32, 2, 1126);
    			attr_dev(p9, "class", "svelte-1u56nyg");
    			add_location(p9, file$9, 33, 2, 1137);
    			attr_dev(p10, "class", "svelte-1u56nyg");
    			add_location(p10, file$9, 37, 2, 1287);
    			attr_dev(p11, "class", "svelte-1u56nyg");
    			add_location(p11, file$9, 38, 2, 1298);
    			attr_dev(p12, "class", "svelte-1u56nyg");
    			add_location(p12, file$9, 43, 2, 1531);
    			attr_dev(p13, "class", "svelte-1u56nyg");
    			add_location(p13, file$9, 44, 2, 1542);
    			attr_dev(p14, "class", "svelte-1u56nyg");
    			add_location(p14, file$9, 45, 2, 1613);
    			attr_dev(p15, "class", "svelte-1u56nyg");
    			add_location(p15, file$9, 46, 2, 1624);
    			attr_dev(p16, "class", "svelte-1u56nyg");
    			add_location(p16, file$9, 52, 2, 1884);
    			attr_dev(p17, "class", "svelte-1u56nyg");
    			add_location(p17, file$9, 53, 2, 1895);
    			attr_dev(p18, "class", "svelte-1u56nyg");
    			add_location(p18, file$9, 58, 2, 2077);
    			attr_dev(p19, "class", "svelte-1u56nyg");
    			add_location(p19, file$9, 59, 2, 2088);
    			attr_dev(p20, "class", "svelte-1u56nyg");
    			add_location(p20, file$9, 60, 2, 2165);
    			attr_dev(p21, "class", "svelte-1u56nyg");
    			add_location(p21, file$9, 61, 2, 2176);
    			attr_dev(p22, "class", "svelte-1u56nyg");
    			add_location(p22, file$9, 67, 2, 2443);
    			attr_dev(p23, "class", "svelte-1u56nyg");
    			add_location(p23, file$9, 68, 2, 2454);
    			attr_dev(p24, "class", "svelte-1u56nyg");
    			add_location(p24, file$9, 73, 2, 2642);
    			attr_dev(p25, "class", "svelte-1u56nyg");
    			add_location(p25, file$9, 74, 2, 2653);
    			attr_dev(p26, "class", "svelte-1u56nyg");
    			add_location(p26, file$9, 78, 2, 2823);
    			attr_dev(p27, "class", "svelte-1u56nyg");
    			add_location(p27, file$9, 79, 2, 2834);
    			attr_dev(p28, "class", "svelte-1u56nyg");
    			add_location(p28, file$9, 89, 2, 3466);
    			attr_dev(p29, "class", "svelte-1u56nyg");
    			add_location(p29, file$9, 90, 2, 3477);
    			attr_dev(p30, "class", "svelte-1u56nyg");
    			add_location(p30, file$9, 94, 2, 3577);
    			attr_dev(p31, "class", "svelte-1u56nyg");
    			add_location(p31, file$9, 95, 2, 3588);
    			attr_dev(p32, "class", "svelte-1u56nyg");
    			add_location(p32, file$9, 100, 2, 3800);
    			attr_dev(p33, "class", "svelte-1u56nyg");
    			add_location(p33, file$9, 101, 2, 3811);
    			attr_dev(p34, "class", "svelte-1u56nyg");
    			add_location(p34, file$9, 107, 2, 4110);
    			attr_dev(p35, "class", "svelte-1u56nyg");
    			add_location(p35, file$9, 108, 2, 4121);
    			attr_dev(p36, "class", "svelte-1u56nyg");
    			add_location(p36, file$9, 114, 2, 4451);
    			attr_dev(p37, "class", "svelte-1u56nyg");
    			add_location(p37, file$9, 115, 2, 4462);
    			attr_dev(p38, "class", "svelte-1u56nyg");
    			add_location(p38, file$9, 120, 2, 4667);
    			attr_dev(p39, "class", "svelte-1u56nyg");
    			add_location(p39, file$9, 121, 2, 4678);
    			attr_dev(p40, "class", "svelte-1u56nyg");
    			add_location(p40, file$9, 122, 2, 4728);
    			attr_dev(p41, "class", "svelte-1u56nyg");
    			add_location(p41, file$9, 123, 2, 4739);
    			attr_dev(p42, "class", "svelte-1u56nyg");
    			add_location(p42, file$9, 124, 2, 4776);
    			attr_dev(p43, "class", "svelte-1u56nyg");
    			add_location(p43, file$9, 125, 2, 4787);
    			attr_dev(p44, "class", "svelte-1u56nyg");
    			add_location(p44, file$9, 129, 2, 4942);
    			attr_dev(p45, "class", "svelte-1u56nyg");
    			add_location(p45, file$9, 130, 2, 4953);
    			attr_dev(p46, "class", "svelte-1u56nyg");
    			add_location(p46, file$9, 134, 2, 5078);
    			attr_dev(p47, "class", "svelte-1u56nyg");
    			add_location(p47, file$9, 135, 2, 5089);
    			attr_dev(p48, "class", "svelte-1u56nyg");
    			add_location(p48, file$9, 140, 2, 5301);
    			attr_dev(p49, "class", "svelte-1u56nyg");
    			add_location(p49, file$9, 141, 2, 5312);
    			attr_dev(p50, "class", "svelte-1u56nyg");
    			add_location(p50, file$9, 142, 2, 5388);
    			attr_dev(p51, "class", "svelte-1u56nyg");
    			add_location(p51, file$9, 143, 2, 5399);
    			attr_dev(p52, "class", "svelte-1u56nyg");
    			add_location(p52, file$9, 144, 2, 5475);
    			attr_dev(p53, "class", "svelte-1u56nyg");
    			add_location(p53, file$9, 145, 2, 5486);
    			attr_dev(p54, "class", "svelte-1u56nyg");
    			add_location(p54, file$9, 149, 2, 5621);
    			attr_dev(p55, "class", "svelte-1u56nyg");
    			add_location(p55, file$9, 150, 2, 5632);
    			attr_dev(p56, "class", "svelte-1u56nyg");
    			add_location(p56, file$9, 156, 2, 5938);
    			attr_dev(p57, "class", "svelte-1u56nyg");
    			add_location(p57, file$9, 157, 2, 5949);
    			attr_dev(p58, "class", "svelte-1u56nyg");
    			add_location(p58, file$9, 163, 2, 6284);
    			attr_dev(p59, "class", "svelte-1u56nyg");
    			add_location(p59, file$9, 164, 2, 6295);
    			attr_dev(p60, "class", "svelte-1u56nyg");
    			add_location(p60, file$9, 169, 2, 6515);
    			attr_dev(p61, "class", "svelte-1u56nyg");
    			add_location(p61, file$9, 170, 2, 6526);
    			attr_dev(p62, "class", "svelte-1u56nyg");
    			add_location(p62, file$9, 174, 2, 6636);
    			attr_dev(p63, "class", "svelte-1u56nyg");
    			add_location(p63, file$9, 175, 2, 6647);
    			attr_dev(p64, "class", "svelte-1u56nyg");
    			add_location(p64, file$9, 179, 2, 6795);
    			attr_dev(p65, "class", "svelte-1u56nyg");
    			add_location(p65, file$9, 180, 2, 6806);
    			attr_dev(p66, "class", "svelte-1u56nyg");
    			add_location(p66, file$9, 183, 2, 6900);
    			attr_dev(p67, "class", "svelte-1u56nyg");
    			add_location(p67, file$9, 184, 2, 6911);
    			attr_dev(p68, "class", "svelte-1u56nyg");
    			add_location(p68, file$9, 188, 2, 7029);
    			attr_dev(p69, "class", "svelte-1u56nyg");
    			add_location(p69, file$9, 189, 2, 7040);
    			attr_dev(p70, "class", "svelte-1u56nyg");
    			add_location(p70, file$9, 197, 2, 7517);
    			attr_dev(p71, "class", "svelte-1u56nyg");
    			add_location(p71, file$9, 198, 2, 7528);
    			attr_dev(p72, "class", "svelte-1u56nyg");
    			add_location(p72, file$9, 202, 2, 7633);
    			attr_dev(p73, "class", "svelte-1u56nyg");
    			add_location(p73, file$9, 203, 2, 7644);
    			attr_dev(p74, "class", "svelte-1u56nyg");
    			add_location(p74, file$9, 207, 2, 7801);
    			attr_dev(p75, "class", "svelte-1u56nyg");
    			add_location(p75, file$9, 208, 2, 7812);
    			attr_dev(p76, "class", "svelte-1u56nyg");
    			add_location(p76, file$9, 214, 2, 8126);
    			attr_dev(p77, "class", "svelte-1u56nyg");
    			add_location(p77, file$9, 215, 2, 8137);
    			attr_dev(p78, "class", "svelte-1u56nyg");
    			add_location(p78, file$9, 223, 2, 8583);
    			attr_dev(p79, "class", "svelte-1u56nyg");
    			add_location(p79, file$9, 224, 2, 8594);
    			attr_dev(p80, "class", "svelte-1u56nyg");
    			add_location(p80, file$9, 230, 2, 8912);
    			attr_dev(p81, "class", "svelte-1u56nyg");
    			add_location(p81, file$9, 231, 2, 8923);
    			attr_dev(p82, "class", "svelte-1u56nyg");
    			add_location(p82, file$9, 235, 2, 9069);
    			attr_dev(p83, "class", "svelte-1u56nyg");
    			add_location(p83, file$9, 236, 2, 9080);
    			attr_dev(p84, "class", "svelte-1u56nyg");
    			add_location(p84, file$9, 237, 2, 9122);
    			attr_dev(p85, "class", "svelte-1u56nyg");
    			add_location(p85, file$9, 238, 2, 9133);
    			attr_dev(p86, "class", "svelte-1u56nyg");
    			add_location(p86, file$9, 242, 2, 9233);
    			attr_dev(p87, "class", "svelte-1u56nyg");
    			add_location(p87, file$9, 243, 2, 9244);
    			attr_dev(p88, "class", "svelte-1u56nyg");
    			add_location(p88, file$9, 247, 2, 9353);
    			attr_dev(p89, "class", "svelte-1u56nyg");
    			add_location(p89, file$9, 248, 2, 9364);
    			attr_dev(p90, "class", "svelte-1u56nyg");
    			add_location(p90, file$9, 249, 2, 9440);
    			attr_dev(p91, "class", "svelte-1u56nyg");
    			add_location(p91, file$9, 250, 2, 9451);
    			attr_dev(p92, "class", "svelte-1u56nyg");
    			add_location(p92, file$9, 255, 2, 9694);
    			attr_dev(p93, "class", "svelte-1u56nyg");
    			add_location(p93, file$9, 256, 2, 9705);
    			attr_dev(p94, "class", "svelte-1u56nyg");
    			add_location(p94, file$9, 260, 2, 9840);
    			attr_dev(p95, "class", "svelte-1u56nyg");
    			add_location(p95, file$9, 261, 2, 9851);
    			attr_dev(p96, "class", "svelte-1u56nyg");
    			add_location(p96, file$9, 266, 2, 10031);
    			attr_dev(p97, "class", "svelte-1u56nyg");
    			add_location(p97, file$9, 267, 2, 10042);
    			attr_dev(p98, "class", "svelte-1u56nyg");
    			add_location(p98, file$9, 273, 2, 10304);
    			attr_dev(p99, "class", "svelte-1u56nyg");
    			add_location(p99, file$9, 274, 2, 10315);
    			attr_dev(p100, "class", "svelte-1u56nyg");
    			add_location(p100, file$9, 281, 2, 10711);
    			attr_dev(p101, "class", "svelte-1u56nyg");
    			add_location(p101, file$9, 282, 2, 10722);
    			attr_dev(p102, "class", "svelte-1u56nyg");
    			add_location(p102, file$9, 287, 2, 10971);
    			attr_dev(p103, "class", "svelte-1u56nyg");
    			add_location(p103, file$9, 288, 2, 10982);
    			attr_dev(p104, "class", "svelte-1u56nyg");
    			add_location(p104, file$9, 289, 2, 11053);
    			attr_dev(p105, "class", "svelte-1u56nyg");
    			add_location(p105, file$9, 290, 2, 11064);
    			attr_dev(p106, "class", "svelte-1u56nyg");
    			add_location(p106, file$9, 291, 2, 11142);
    			attr_dev(p107, "class", "svelte-1u56nyg");
    			add_location(p107, file$9, 292, 2, 11153);
    			attr_dev(p108, "class", "svelte-1u56nyg");
    			add_location(p108, file$9, 296, 2, 11271);
    			attr_dev(p109, "class", "svelte-1u56nyg");
    			add_location(p109, file$9, 297, 2, 11282);
    			attr_dev(p110, "class", "svelte-1u56nyg");
    			add_location(p110, file$9, 298, 2, 11311);
    			attr_dev(p111, "class", "svelte-1u56nyg");
    			add_location(p111, file$9, 299, 2, 11322);
    			attr_dev(p112, "class", "svelte-1u56nyg");
    			add_location(p112, file$9, 300, 2, 11357);
    			attr_dev(p113, "class", "svelte-1u56nyg");
    			add_location(p113, file$9, 301, 2, 11368);
    			attr_dev(p114, "class", "svelte-1u56nyg");
    			add_location(p114, file$9, 302, 2, 11392);
    			attr_dev(p115, "class", "svelte-1u56nyg");
    			add_location(p115, file$9, 303, 2, 11403);
    			attr_dev(p116, "class", "svelte-1u56nyg");
    			add_location(p116, file$9, 304, 2, 11444);
    			attr_dev(div, "class", "text");
    			add_location(div, file$9, 5, 0, 106);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, p0);
    			append_dev(div, t1);
    			append_dev(div, p1);
    			append_dev(div, t3);
    			append_dev(div, p2);
    			append_dev(div, t5);
    			append_dev(div, p3);
    			append_dev(div, t7);
    			append_dev(div, p4);
    			append_dev(div, t9);
    			append_dev(div, p5);
    			append_dev(div, t11);
    			append_dev(div, p6);
    			append_dev(div, t13);
    			append_dev(div, p7);
    			append_dev(div, t15);
    			append_dev(div, p8);
    			append_dev(div, t17);
    			append_dev(div, p9);
    			append_dev(div, t19);
    			append_dev(div, p10);
    			append_dev(div, t21);
    			append_dev(div, p11);
    			append_dev(div, t23);
    			append_dev(div, p12);
    			append_dev(div, t25);
    			append_dev(div, p13);
    			append_dev(div, t27);
    			append_dev(div, p14);
    			append_dev(div, t29);
    			append_dev(div, p15);
    			append_dev(div, t31);
    			append_dev(div, p16);
    			append_dev(div, t33);
    			append_dev(div, p17);
    			append_dev(div, t35);
    			append_dev(div, p18);
    			append_dev(div, t37);
    			append_dev(div, p19);
    			append_dev(div, t39);
    			append_dev(div, p20);
    			append_dev(div, t41);
    			append_dev(div, p21);
    			append_dev(div, t43);
    			append_dev(div, p22);
    			append_dev(div, t45);
    			append_dev(div, p23);
    			append_dev(div, t47);
    			append_dev(div, p24);
    			append_dev(div, t49);
    			append_dev(div, p25);
    			append_dev(div, t51);
    			append_dev(div, p26);
    			append_dev(div, t53);
    			append_dev(div, p27);
    			append_dev(div, t55);
    			append_dev(div, p28);
    			append_dev(div, t57);
    			append_dev(div, p29);
    			append_dev(div, t59);
    			append_dev(div, p30);
    			append_dev(div, t61);
    			append_dev(div, p31);
    			append_dev(div, t63);
    			append_dev(div, p32);
    			append_dev(div, t65);
    			append_dev(div, p33);
    			append_dev(div, t67);
    			append_dev(div, p34);
    			append_dev(div, t69);
    			append_dev(div, p35);
    			append_dev(div, t71);
    			append_dev(div, p36);
    			append_dev(div, t73);
    			append_dev(div, p37);
    			append_dev(div, t75);
    			append_dev(div, p38);
    			append_dev(div, t77);
    			append_dev(div, p39);
    			append_dev(div, t79);
    			append_dev(div, p40);
    			append_dev(div, t81);
    			append_dev(div, p41);
    			append_dev(div, t83);
    			append_dev(div, p42);
    			append_dev(div, t85);
    			append_dev(div, p43);
    			append_dev(div, t87);
    			append_dev(div, p44);
    			append_dev(div, t89);
    			append_dev(div, p45);
    			append_dev(div, t91);
    			append_dev(div, p46);
    			append_dev(div, t93);
    			append_dev(div, p47);
    			append_dev(div, t95);
    			append_dev(div, p48);
    			append_dev(div, t97);
    			append_dev(div, p49);
    			append_dev(div, t99);
    			append_dev(div, p50);
    			append_dev(div, t101);
    			append_dev(div, p51);
    			append_dev(div, t103);
    			append_dev(div, p52);
    			append_dev(div, t105);
    			append_dev(div, p53);
    			append_dev(div, t107);
    			append_dev(div, p54);
    			append_dev(div, t109);
    			append_dev(div, p55);
    			append_dev(div, t111);
    			append_dev(div, p56);
    			append_dev(div, t113);
    			append_dev(div, p57);
    			append_dev(div, t115);
    			append_dev(div, p58);
    			append_dev(div, t117);
    			append_dev(div, p59);
    			append_dev(div, t119);
    			append_dev(div, p60);
    			append_dev(div, t121);
    			append_dev(div, p61);
    			append_dev(div, t123);
    			append_dev(div, p62);
    			append_dev(div, t125);
    			append_dev(div, p63);
    			append_dev(div, t127);
    			append_dev(div, p64);
    			append_dev(div, t129);
    			append_dev(div, p65);
    			append_dev(div, t131);
    			append_dev(div, p66);
    			append_dev(div, t133);
    			append_dev(div, p67);
    			append_dev(div, t135);
    			append_dev(div, p68);
    			append_dev(div, t137);
    			append_dev(div, p69);
    			append_dev(div, t139);
    			append_dev(div, p70);
    			append_dev(div, t141);
    			append_dev(div, p71);
    			append_dev(div, t143);
    			append_dev(div, p72);
    			append_dev(div, t145);
    			append_dev(div, p73);
    			append_dev(div, t147);
    			append_dev(div, p74);
    			append_dev(div, t149);
    			append_dev(div, p75);
    			append_dev(div, t151);
    			append_dev(div, p76);
    			append_dev(div, t153);
    			append_dev(div, p77);
    			append_dev(div, t155);
    			append_dev(div, p78);
    			append_dev(div, t157);
    			append_dev(div, p79);
    			append_dev(div, t159);
    			append_dev(div, p80);
    			append_dev(div, t161);
    			append_dev(div, p81);
    			append_dev(div, t163);
    			append_dev(div, p82);
    			append_dev(div, t165);
    			append_dev(div, p83);
    			append_dev(div, t167);
    			append_dev(div, p84);
    			append_dev(div, t169);
    			append_dev(div, p85);
    			append_dev(div, t171);
    			append_dev(div, p86);
    			append_dev(div, t173);
    			append_dev(div, p87);
    			append_dev(div, t175);
    			append_dev(div, p88);
    			append_dev(div, t177);
    			append_dev(div, p89);
    			append_dev(div, t179);
    			append_dev(div, p90);
    			append_dev(div, t181);
    			append_dev(div, p91);
    			append_dev(div, t183);
    			append_dev(div, p92);
    			append_dev(div, t185);
    			append_dev(div, p93);
    			append_dev(div, t187);
    			append_dev(div, p94);
    			append_dev(div, t189);
    			append_dev(div, p95);
    			append_dev(div, t191);
    			append_dev(div, p96);
    			append_dev(div, t193);
    			append_dev(div, p97);
    			append_dev(div, t195);
    			append_dev(div, p98);
    			append_dev(div, t197);
    			append_dev(div, p99);
    			append_dev(div, t199);
    			append_dev(div, p100);
    			append_dev(div, t201);
    			append_dev(div, p101);
    			append_dev(div, t203);
    			append_dev(div, p102);
    			append_dev(div, t205);
    			append_dev(div, p103);
    			append_dev(div, t207);
    			append_dev(div, p104);
    			append_dev(div, t209);
    			append_dev(div, p105);
    			append_dev(div, t211);
    			append_dev(div, p106);
    			append_dev(div, t213);
    			append_dev(div, p107);
    			append_dev(div, t215);
    			append_dev(div, p108);
    			append_dev(div, t217);
    			append_dev(div, p109);
    			append_dev(div, t219);
    			append_dev(div, p110);
    			append_dev(div, t221);
    			append_dev(div, p111);
    			append_dev(div, t223);
    			append_dev(div, p112);
    			append_dev(div, t225);
    			append_dev(div, p113);
    			append_dev(div, t227);
    			append_dev(div, p114);
    			append_dev(div, t229);
    			append_dev(div, p115);
    			append_dev(div, t231);
    			append_dev(div, p116);
    			current = true;
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    		},
    		i: function intro(local) {
    			if (current) return;

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
    			if (detaching) detach_dev(div);
    			if (detaching && div_outro) div_outro.end();
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
    	validate_slots("OnlyJust", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<OnlyJust> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ blur, linear: identity });
    	return [];
    }

    class OnlyJust extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "OnlyJust",
    			options,
    			id: create_fragment$b.name
    		});
    	}
    }

    /* src/routes/pieces/Scarf.svelte generated by Svelte v3.32.3 */
    const file$a = "src/routes/pieces/Scarf.svelte";

    function create_fragment$c(ctx) {
    	let div;
    	let p0;
    	let t1;
    	let p1;
    	let t3;
    	let p2;
    	let t5;
    	let p3;
    	let t7;
    	let p4;
    	let t8;
    	let em0;
    	let t10;
    	let em1;
    	let t12;
    	let em2;
    	let t14;
    	let em3;
    	let t16;
    	let t17;
    	let blockquote0;
    	let t19;
    	let p5;
    	let t21;
    	let p6;
    	let t23;
    	let p7;
    	let t25;
    	let p8;
    	let t27;
    	let p9;
    	let t29;
    	let p10;
    	let t31;
    	let p11;
    	let t33;
    	let p12;
    	let t35;
    	let blockquote1;
    	let t37;
    	let p13;
    	let t39;
    	let p14;
    	let t41;
    	let blockquote2;
    	let t43;
    	let p15;
    	let t45;
    	let p16;
    	let t47;
    	let p17;
    	let t49;
    	let p18;
    	let t51;
    	let p19;
    	let t53;
    	let p20;
    	let t55;
    	let p21;
    	let t57;
    	let p22;
    	let t59;
    	let p23;
    	let t61;
    	let p24;
    	let t63;
    	let p25;
    	let t65;
    	let p26;
    	let t67;
    	let p27;
    	let t69;
    	let p28;
    	let t71;
    	let p29;
    	let t73;
    	let p30;
    	let t75;
    	let p31;
    	let t77;
    	let p32;
    	let t79;
    	let p33;
    	let div_intro;
    	let div_outro;
    	let current;

    	const block = {
    		c: function create() {
    			div = element("div");
    			p0 = element("p");
    			p0.textContent = "Last year, during long-delayed works on our home, our family struggled to\n    find anywhere to rent. My husband’s father agreed to lend us the\n    twenty-five-year-old campervan he had recently purchased. For an uncertain\n    number of months its three beds, chemical toilet, two-ring gas hob,\n    child-sized sink and mini-fridge would accommodate the six of us.";
    			t1 = space();
    			p1 = element("p");
    			p1.textContent = "We did our best to adapt. I took to loitering in the schoolyard long after\n    everyone else had left, so the children could play and shout and run. My\n    husband hauled our ancient washing machine onto a table in the garage and\n    improvised a rickety slide from old gutters and twine, rollercoastering suds\n    out to the drain. The van’s side window, slightly ajar, became our\n    letterbox; we thanked the postman through mouthfuls of cereal. I grew used\n    to fetching water from the fresh-water pipe that lay in the gravel outside,\n    but not to the stiff valve that always sprayed my shins, nor to the grit\n    that inevitably found its way into my coffee. It’s only for a few months, we\n    said, as the six of us showered in a local gym. Any time a cheap Airbnb\n    became available within a ninety-minute drive, we hurried to its heaters,\n    oven dinners and hot water – but such occasions were rare, and winter was\n    approaching.";
    			t3 = space();
    			p2 = element("p");
    			p2.textContent = "It grew cold. Storm clouds gathered; the van flinched from the gales. I\n    flinched too. No matter how long I bent over that small sink, scrubbing,\n    always scrubbing, our belongings felt grimy. If two of us stood upright at\n    once, the van felt intolerably crowded. I didn’t scream, but I often wanted\n    to. When I dug out our box of hats and gloves, I held the familiar darkness\n    of my favourite scarf to my face, inhaling deeply. It smelled like home. I\n    began to wear it all the time, taking it off only while I slept.";
    			t5 = space();
    			p3 = element("p");
    			p3.textContent = "An invitation to spend the Halloween midterm at a friend’s empty cottage in\n    Mayo seemed too good to be true: a week of warm beds would be luxurious, not\n    to mention a dishwasher. There was something else, too: a half-remembered\n    family myth from Mayo. Stray threads began to come back to me as we drove\n    the tunnel deep under the Shannon. My young great-grandfather on the run;\n    soldiers surrounding a church while he was at mass; and his escape disguised\n    as a woman.";
    			t7 = space();
    			p4 = element("p");
    			t8 = text("In Clare we paused for lunch at my parents’ home. While the children\n    squabbled over pizza, I poked through bookshelves until I found what I was\n    looking for. The first folder had been compiled by my grandfather and\n    incorporated reminiscences of his own youth, a vast family tree, and\n    recollections of his father, Pádhraic Ó Gabhláin. Pádhraic was the subject\n    of the second folder too, a college project submitted by my mother as part\n    of her teacher training. This included an appendix of photocopied sources:\n    handwritten letters, old maps, obituaries, and copies of articles from the ");
    			em0 = element("em");
    			em0.textContent = "Freeman’s Journal";
    			t10 = text(", ");
    			em1 = element("em");
    			em1.textContent = "An Claidheamh Solais";
    			t12 = text(", the ");
    			em2 = element("em");
    			em2.textContent = "Western People";
    			t14 = text(", and the\n    ");
    			em3 = element("em");
    			em3.textContent = "Irish Independent";
    			t16 = text(". Having little time before we had to get back on\n    the road, I flicked through the obituaries until I found a trace of the\n    story I sought, documented in newsprint by his friend Aodh Ó Nualláin. The\n    obituary described events that had occurred one Sunday at Aghamore church in\n    east Mayo during the War of Independence, when ‘a company of military\n    arrived and surrounded the church’. Pádhraic – a member of what was\n    initially known as the Irish Volunteers and later as the IRA –");
    			t17 = space();
    			blockquote0 = element("blockquote");
    			blockquote0.textContent = "by dressing as a woman and walking out of the church with as much dignity as\n    possible among the women members of the congregation. Apparently there was\n    some delay in getting the proper fit in clothes and shoes, but the celebrant\n    of the mass, the late Reverend Father Garvey, was a staunch Republican, and\n    many in the congregation noticed that on that particular Sunday the prayers\n    after mass were unusually long.";
    			t19 = space();
    			p5 = element("p");
    			p5.textContent = "I wanted to know more, but it was nearly time to leave. I made a quick run\n    to the copy-shop and then hurried the folders back to the shelf.";
    			t21 = space();
    			p6 = element("p");
    			p6.textContent = "As we drove onwards to Mayo, I held my photocopies close. It was dark by the\n    time we found our way to the cottage, unpacked, and put the children to bed.\n    I poured a glass of wine, opened the documents, and began at the beginning.";
    			t23 = space();
    			p7 = element("p");
    			p7.textContent = "Born in 1892, Pádhraic left primary schooling to work on local farms and\n    bogs, travelling alongside his neighbours to labour seasonally in England.\n    This cluster of families had worked side by side for generations – the\n    Bolands, Greallys, Spellmans, and Forkans had been neighbours since\n    pre-Famine times, my grandfather wrote, their names marked on landlord’s\n    maps ‘of linen in Indian ink and watercolour with lists of tenants and\n    holdings’. He and his best friend Hugh Nolan (who, decades later, would sign\n    his obituary as Aodh Ó Nualláin) were sometimes overheard chatting about\n    characters from Dickens in terms so familiar that passers-by presumed they\n    were speaking of locals. Together, they started a pamphlet that was posted\n    from house to house, with each recipient filling an empty page with a new\n    story.";
    			t25 = space();
    			p8 = element("p");
    			p8.textContent = "The 1911 census noted that Pádhraic’s parents spoke both Irish and English,\n    whereas he and his siblings spoke English only. There, he was documented\n    under the name he grew up with: Patrick Forkan. Shortly thereafter, in his\n    early twenties, he and some friends were chatting by the roadside when a\n    passing teacher greeted the group casually in Irish. My great grandfather\n    felt such shame at his inability to reply that he began to attend Irish\n    classes. He quickly took to the language. Such was the demand among young\n    people wishing to do likewise at that time that anyone who had gained a\n    minimal fluency in Irish was asked to volunteer to instruct new students. In\n    those slapdash classrooms he found his vocation; and henceforth he always\n    used the Irish form of his name. Teaching was to become what Ó Nualláin’s\n    obituary described as ‘the pleasure of his life’. Beyond those classes, his\n    days were spent in farmwork, reading, and writing.";
    			t27 = space();
    			p9 = element("p");
    			p9.textContent = "By April 1917 Pádhraic was secretary of a local branch of Conradh na Gaeilge\n    and had established a company of the Irish Volunteers in Crossard.\n    Photographed at the Sinn Féin ardfheis with neat tie, crisp collar, and hair\n    swept to the side, he smiled with earnest eyes. He did not know what was to\n    come. No one did. I found that my own grasp of what was to come was lacking\n    too, so I turned to the internet to fill the gaps in my knowledge of the War\n    of Independence. By 1920, I read, attacks on the constabulary were growing\n    so common all over the country that supplementary forces were deployed. So\n    many of the Black and Tans and Auxiliaries arriving in Ballyhaunis had\n    fought in the First World War that the area in which they were billeted was\n    nicknamed ‘The Dardanelles’. Incidents of cruelty, drunken violence and\n    torture were soon reported across Mayo. In response, local resistance groups\n    grew, companies of the Irish Volunteers proliferated, and both ambushes and\n    retaliatory acts of violence intensified.";
    			t29 = space();
    			p10 = element("p");
    			p10.textContent = "Ó Nualláin noted that Pádhraic took a very active part in the organisation\n    of the Ballyhaunis Battalion, a fact that was apparently noticed by the\n    Occupation Forces of the area, for from early in the troubled times he\n    seemed to have attracted their particular attention. From documents captured\n    by the Dublin brigade and forwarded to the local volunteers it became clear\n    that he was a marked man, and he was obliged to go ‘on the run’ and remain\n    constantly on the alert.";
    			t31 = space();
    			p11 = element("p");
    			p11.textContent = "The next morning, I cleared the children’s breakfast bowls from the table\n    and searched groggily through the online archives of the Bureau of Military\n    History, hoping to find Pádhraic’s story recounted in his own words; but it\n    seems he did not provide testimony to the Bureau. I did find his name in\n    documentation from the Military Service Pensions Collection, dated 1935, in\n    which those who fought in Mayo battalions were listed retrospectively. His\n    name is among those recalled by Captain Seán Carney, who listed him as\n    Patrick Forkan of the 2nd Western Division, I Brigade (South Mayo), 5th\n    Battalion, B Company. Many of the surnames my grandfather had noted on local\n    pre-Famine maps were also listed in this company, suggesting that he was\n    among friends and neighbours.";
    			t33 = space();
    			p12 = element("p");
    			p12.textContent = "In the absence of a description in my great-grandfather’s own words, I\n    sought out accounts by the others. Ernie O’Malley’s oral history of the War\n    of Independence in Mayo was available online, and there I read how Johnny\n    Greally – a man who was born, grew up, lived, and fought by Pádhraic’s side\n    – described the day their commanding officer, Seán Corcoran, was murdered:";
    			t35 = space();
    			blockquote1 = element("blockquote");
    			blockquote1.textContent = "We heard that Curley’s house was to be burned, and we went to get rifles to\n    defend it. Seán and Maurice Mullins were supposed to call at this house, but\n    when he was coming over Seán ran into a patrol of Tans. His revolver jammed\n    at the first shot and he was shot dead, and Maurice, who was unarmed, was\n    beaten almost to death. They beat him there and they threw him in on top of\n    the dead Seán Corcoran in the turf house of the Barracks.";
    			t37 = space();
    			p13 = element("p");
    			p13.textContent = "Later that day, a sniper shot one of the Black and Tans in retaliation. As\n    vengeance, the Black and Tans murdered a local man named Michael Coen,\n    mutilating his corpse: ‘they cut off his private parts and pinned them on\n    his breast, and they cut the flesh of his legs and arms. They cut off his\n    ears and left him out on the road. They were night and day in that area in\n    Crossard townland, searching, for they must have had information. [...] The\n    people stiffened their resistance.’";
    			t39 = space();
    			p14 = element("p");
    			p14.textContent = "I do not know what part, if any, Pádhraic played in the events of that day,\n    but Greally’s account allowed me a glimpse of the environment in which he\n    was engaged. Pádhraic was one of many who survived by stealth in those\n    years, hurrying from safe-house to safe-house. His continued evasion of the\n    Black and Tans became a source of local bafflement. Ó Nualláin writes:";
    			t41 = space();
    			blockquote2 = element("blockquote");
    			blockquote2.textContent = "In spite of the special enemy attention he took part in all the activities\n    of the area and was never captured, although his many hairbreadth escapes\n    made him almost a legendary figure in his native district. On one occasion\n    when visiting his own home he was suddenly told that a large force of police\n    and military were surrounding the house. He slipped out, however, and\n    although the enemy opened fire, his knowledge of the country enabled him to\n    escape.";
    			t43 = space();
    			p15 = element("p");
    			p15.textContent = "Greally explained to Ernie O’Malley that their small group ‘had no arms save\n    shotguns. There were a couple of rifles but you couldn’t be sure of them. We\n    fired off ammunition from Seán Corcoran’s rifles, but only an odd round went\n    off. We had very few short arms.’ The best resource at their disposal was\n    the goodwill offered by neighbours, whether through shelter or sustenance.";
    			t45 = space();
    			p16 = element("p");
    			p16.textContent = "Within a month of Corcoran and Coen’s deaths, I read, the men found\n    themselves in peril again, having been traced to a remote area of bogland.\n    Greally described how the Black and Tans had information that we would be in\n    the bog, the six of us, myself and Paddy Boland, the company O/C, Pádhraic\n    Forkan, a Gaelic teacher, Austin Kenny and Jim Kilkelly. They wanted these\n    six of us. We were in a neighbour’s house where we used to stay, when Paddy\n    Mullins, the Brigadier, sent over bombs with me. The Master sent word to us\n    by a young lad, who came across the fields, and we had just time to get out.\n    They, the soldiers, fired shots, and they went into the house again, and\n    they bayoneted poor Paddy Boland who was an only son. They bursted the\n    bayonet in him and they almost cut his nose off with a bayonet also.";
    			t47 = space();
    			p17 = element("p");
    			p17.textContent = "The neighbour in whose house they had sheltered was my\n    great-great-grandmother: Pádhraic would marry her daughter. I remembered her\n    from a section of my grandfather’s reminiscences I’d read the night before,\n    a memorable passage that skipped from amusement to dread within a single\n    paragraph: My grandmother looked like a grandmother. She was fat and\n    comfortable and dressed in black. [...] She said very little about ‘the\n    troubles’. The only thing I remember was her account of the day when Paddy\n    Boland was shot. ‘The boys’ had run from her house as the troops approached\n    and scattered across the bog. Paddy Boland was shot dead a few hundred yards\n    from the house. She watched from a window as his body was carried on an\n    improvised stretcher covered in a blanket. It was only when she could see\n    the boots that she knew it was not one of her own sons.";
    			t49 = space();
    			p18 = element("p");
    			p18.textContent = "The date of Pádhraic’s escape from Aghamore church is not recorded in any\n    document I have seen; all we know for sure is that it must have happened\n    during the year and a half between the arrival of the Black and Tans in\n    Ireland, at the beginning of 1920, and the truce that was agreed in the\n    summer of 1921.";
    			t51 = space();
    			p19 = element("p");
    			p19.textContent = "After the truce, and the treaty, and the split in the republican movement,\n    Pádhraic couldn’t bring himself to participate in the civil war that com\n    menced in the summer of 1922. Another obituary, by C. Caimbhéal, noted that\n    ‘He was a respecter of valour and worth in any who had shown faith in their\n    cause. I recall his yearly buying of poppies from an ex-army captain on\n    Armistice Day. He was no bigot.’ He married. He wrote. He worked. His\n    children were born. He returned to his beloved books. He secured a job at\n    Ballyhaunis Vocational School, and filled his summers with further teaching\n    at Coláiste Chonnacht, in the heartlands of Conamara. He loved to read, to\n    write, to teach, and to laugh.";
    			t53 = space();
    			p20 = element("p");
    			p20.textContent = "My grandfather noted that ‘a straightforward description of my father’s\n    subsequent career might make him sound like a worthy, earnest and dull\n    character. This is as far from the truth as could be. One of the most\n    obvious things about him was his sense of humour – wild, anarchical humour\n    in his youth; warm and witty in his later years and never fully subdued by\n    old age.’ Reading this line, I wished that I could have heard him laugh.\n    When Pádhraic died in 1965, his coffin was draped in the tricolour, and his\n    surviv- ing comrades, Johnny Greally among them, formed a guard of honour. A\n    passionate graveside oration was delivered by John P. Jordan. Of this\n    funeral, C. Caimbhéal wrote: ‘There were no tears on any face for it was the\n    honouring of a warrior, and none weep when a soldier sleeps when his fight\n    is over.’";
    			t55 = space();
    			p21 = element("p");
    			p21.textContent = "After closing the folders and all the tabs on my phone, I couldn’t stop\n    thinking about what I’d read. I woke that night thinking of how the young\n    Pádhraic had sent his little pamphlets from house to house, always including\n    empty pages in which recipients could add a new story. So far, his son and\n    granddaughter and several obituarists had filled pages with their writings\n    on his life; perhaps I could add a page, too. ‘Cloch le carn’ is the phrase\n    used for the traditional act of adding one’s own stone to a cairn made in\n    memory of another. Rather than a cairn, however, I found myself thinking of\n    the story as a beloved scarf, a garment whose stitches I had already begun\n    to unpick into a soft mass of unravelled facts. As a girl, the story of his\n    escape from Aghamore church had seemed a neatly woven tale of adventure,\n    prudently tailored to a child’s ears: no torn flesh, no torture, no terror.\n    Now that the dark red of Greally’s voice had seeped in, however, there could\n    be no erasing it. I wondered what other threads might add themselves as I\n    set upon knitting my own telling of it.";
    			t57 = space();
    			p22 = element("p");
    			p22.textContent = "It was this curiosity that led me to bring the whole family to the church at\n    Aghamore the following day. We are not a family of mass-goers, and I can’t\n    recall how I sold them on this road trip. As soon as we parked, I hurried\n    ahead, certain that I wouldn’t have much time before the kids lost patience,\n    before pausing in the porch, suddenly nervous. I would be alone, if only for\n    the length of time it took my husband to wrestle coats and hats onto our\n    children. A residual whiff of sanctity haunted the air. My breath was short\n    and growing shorter – I had wound my scarf too well, I realized, tucking a\n    finger between fabric and throat until it gave a little. I drank a deep\n    lungful and watched my breath hurry away, a small fog, or a ghost: glimpsed,\n    then gone. I pushed the door and stepped into the story.";
    			t59 = space();
    			p23 = element("p");
    			p23.textContent = "The church was empty. I moved quickly up the aisle, snapshotting details on\n    my phone as I went: a statue, an altar cloth, a dent worn into the floor by\n    many decades of footfall. Outside, clouds broke and blew; when shards of\n    sunlight met stained-glass eyes, I wondered whether those glassy faces had\n    felt alive to my great-grandfather, too. Above my head, the intricately\n    crafted timber roof was neat as a ribcage. All his life, Pádhraic returned\n    to pray here, surrounding himself with the same people, all standing and\n    kneeling in uni- son, their voices murmuring a warm chorus around his.\n    Together and alone, they aged. Theirs were the eyes that met his in worship,\n    on feast days, at funerals and baptisms, on the day he escaped from the\n    Crown forces, and on his wedding day.";
    			t61 = space();
    			p24 = element("p");
    			p24.textContent = "My children flung open the door and galloped toward me, raucous as ever,\n    with coats flapping open, hats and scarves forgotten, shouldering into each\n    other, giggling and squabbling, their cheeks already reddened by cold. I\n    rolled my eyes at my husband – it is a running joke between us that while I\n    mollycoddle the children with mittens and vests and thermal underwear, he\n    believes that a little cold will toughen them. Sitting in the pew with a\n    child on each knee and another in each elbow, I began to adjust the story\n    for their ears; but soon they were whingeing for the car. The only one who\n    insisted on staying was the boy who always stays by my side when I lead my\n    family on such jaunts, the child who at seven is skinny and bold and bright\n    and always fights to hold my hand. I continued to photograph the little\n    details that surrounded us, and that had once surrounded Pádhraic: the\n    dinged brass of the altar bells, the dark lustre of the confessional box,\n    the altar that had never figured in my imaginings until its inscription\n    loomed before me. Sanctus, Sanctus, Sanctus: a male figure was carved there,\n    each fold of his gown whittled from cold stone. Holy, Holy.";
    			t63 = space();
    			p25 = element("p");
    			p25.textContent = "Only when my son whispered ‘I’m cold, Mám,’ did I notice that his coat had\n    been forgotten altogether. I was glad of the warmth my body had pressed into\n    the weft of my scarf as I wound it into a pullover of sorts, criss- crossing\n    its endings into his waistband: snug. I pressed my lips to his forehead and\n    on we went with my hand in his, or his in mine. When he asked what we were\n    looking for, I couldn’t answer because I didn’t know, beyond the sense that\n    he and I had entered the story, and now we had to find our way towards some\n    sort of an ending. Perhaps the gesture of leaving a lit- tle flame in our\n    wake might do it? No, all the wicks were unlit, and I could see no matches.";
    			t65 = space();
    			p26 = element("p");
    			p26.textContent = "My son shrugged and asked me to finish telling the story, and I did, and was\n    surprised on approaching the ending to find myself saying, ‘and if it\n    weren’t for that moment, would we be here today, you and me?’";
    			t67 = space();
    			p27 = element("p");
    			p27.textContent = "I was smiling as I turned towards the door, until my son broke away to dash\n    a giddy circuit of the room, hee-hawing the chorus of ‘Old Town Road’ and\n    cackling over his shoulder. From the porch I called to him in exasperation,\n    then called again, my voice growing colder now, cold and cranky. While I\n    waited, I lined up one last photo of the aisle, the door ajar to show its\n    neat symmetry of empty pews; but just as I got the framing right, my son\n    hurtled through the shot, blurring past me and sprinting out towards the\n    car. Little trespasser. I arranged the photo again, and then turned to catch\n    up with him. The door of the church thumped heavily behind us.";
    			t69 = space();
    			p28 = element("p");
    			p28.textContent = "In the car, my husband was thumbing his phone and the children were munching\n    chocolate biscuits. I felt satisfied as I clicked my seatbelt – seeing this\n    place felt like some small achievement to show for our cold months away from\n    home. But back in the cottage, I couldn’t sleep for incessant fid- geting:\n    the story wouldn’t rest. If I couldn’t hear the story of this escape in\n    Pádhraic’s own voice, then maybe there was a way to hear it in the voice of\n    one who had stood by him. My mother had once heard a man on the radio\n    describe how, long ago, his grandmother had disguised a man at mass to save\n    him from the Black and Tans. She had made a note of the man’s name. Tadhg\n    Mac Dhonnagáin was a publisher of Irish-language books, and I knew him a\n    little from Twitter. He lived in Conamara, only an hour and a half or so\n    away. I found his email address. I told him that I wanted to know how this\n    story had been told in his childhood.";
    			t71 = space();
    			p29 = element("p");
    			p29.textContent = "In the Buillín Blasta café in An Spidéal, Tadhg described his grandmother,\n    Annie Kenny: a bright young woman who had been awarded a teacher-train- ing\n    scholarship in Belfast, but still travelled home at weekends to lead the\n    church choir. The story he had inherited began there, with a young woman\n    leading a chorus of voices, called to a sudden act of courage, then hurrying\n    to save a life. It was a tale he had treasured as a child, Tadhg said, and\n    he told it beautifully: Annie’s quick thinking, her gathering of garments,\n    her supervision of the disguise, her palms rubbing distemper from the walls\n    to press on Pádhraic’s cheeks. His favourite part of all, he said, was the\n    importance placed on one detail: the height of the women chosen to escort\n    him to safety. Those women: they were tall.";
    			t73 = space();
    			p30 = element("p");
    			p30.textContent = "I thanked Tadhg for his time, wound myself back into my scarf and rummaged\n    my car keys from my handbag. Driving back to Mayo, between mountains and\n    bogs, over stone bridges and boreens, I pictured Annie on the church\n    mezzanine, her hair braided and pinned high, her face among the crowd in the\n    choir, alive and afraid. A wild, fearful whisper was flying through the\n    church below. She watched as one person whispered in dread to the next: they\n    were surrounded. The soldiers were outside with their guns.";
    			t75 = space();
    			p31 = element("p");
    			p31.textContent = "When the whisper reached Pádhraic’s ear, I imagine that he sat in silence a\n    moment, assessing his predicament and that of the people around him. There\n    were elderly people present, women, and children. If he surrendered, might\n    others be spared?";
    			t77 = space();
    			p32 = element("p");
    			p32.textContent = "The priest, knowing these soldiers as brutally violent and unpredictable,\n    bought time by lengthening the prayers. Annie hurried down from the choir\n    and gathered garments: a dark shawl here, a skirt there, perhaps a blouse.\n    Pádhraic was urged to his feet and dressed. Palms were pressed to damp\n    walls, and then to the shadow of his stubble. A black shawl was drawn over\n    the crest of his skull, quick as a shadow. The priest drew the prayers to\n    their end. The two tallest women stood by him, arm in arm, their trio folded\n    within the close crowd. Elbows trembled. Down the aisle they all went, out\n    the door, past the soldiers. Eyes lowered. Jaws tight. No flinching. A\n    procession of bodies leaving the church gates and walking steadily away:\n    almost an ordinary sight. On this Sunday, everyone leaves alive. The End.";
    			t79 = space();
    			p33 = element("p");
    			p33.textContent = "Exhilarated and weary from driving, I fell into bed early, but my heart\n    raced, and my toes twitched: too much coffee. Eventually I fumbled my phone\n    from where it was charging on the floor and swiped idly through pho- tos of\n    our trip: playgrounds, mountains, the gift of a barmbrack, Harry Clarke\n    windows in Ballinrobe, a little dog called Marcie. I came to the penultimate\n    photo I’d taken in the church, the one that had vexed me when my son flung\n    himself through it. I zoomed in by fingertip. There was the aisle, along\n    which a male shadow hurried. By the next photo the aisle was empty. How\n    brief, his presence: glimpsed, then gone. When I swiped back, though, he\n    reappeared, wrapped again in a borrowed shawl, folded into the fabric of\n    that inherited story – too big and too dark – in which we all find ourselves\n    bound by those who came before us.";
    			add_location(p0, file$a, 10, 2, 269);
    			add_location(p1, file$a, 17, 2, 650);
    			add_location(p2, file$a, 32, 2, 1615);
    			add_location(p3, file$a, 41, 2, 2168);
    			add_location(em0, file$a, 58, 79, 3296);
    			add_location(em1, file$a, 60, 7, 3336);
    			add_location(em2, file$a, 60, 42, 3371);
    			add_location(em3, file$a, 61, 4, 3408);
    			add_location(p4, file$a, 50, 2, 2673);
    			add_location(blockquote0, file$a, 69, 2, 3945);
    			add_location(p5, file$a, 77, 2, 4413);
    			add_location(p6, file$a, 81, 2, 4574);
    			add_location(p7, file$a, 86, 2, 4829);
    			add_location(p8, file$a, 100, 2, 5705);
    			add_location(p9, file$a, 115, 2, 6714);
    			add_location(p10, file$a, 131, 2, 7799);
    			add_location(p11, file$a, 140, 2, 8314);
    			add_location(p12, file$a, 153, 2, 9146);
    			add_location(blockquote1, file$a, 160, 2, 9553);
    			add_location(p13, file$a, 168, 2, 10048);
    			add_location(p14, file$a, 177, 2, 10570);
    			add_location(blockquote2, file$a, 184, 2, 10975);
    			add_location(p15, file$a, 193, 2, 11489);
    			add_location(p16, file$a, 200, 2, 11903);
    			add_location(p17, file$a, 213, 2, 12773);
    			add_location(p18, file$a, 227, 2, 13687);
    			add_location(p19, file$a, 234, 2, 14028);
    			add_location(p20, file$a, 246, 2, 14782);
    			add_location(p21, file$a, 260, 2, 15666);
    			add_location(p22, file$a, 277, 2, 16830);
    			add_location(p23, file$a, 290, 2, 17697);
    			add_location(p24, file$a, 303, 2, 18533);
    			add_location(p25, file$a, 321, 2, 19782);
    			add_location(p26, file$a, 332, 2, 20514);
    			add_location(p27, file$a, 337, 2, 20748);
    			add_location(p28, file$a, 348, 2, 21456);
    			add_location(p29, file$a, 363, 2, 22455);
    			add_location(p30, file$a, 376, 2, 23309);
    			add_location(p31, file$a, 385, 2, 23853);
    			add_location(p32, file$a, 391, 2, 24127);
    			add_location(p33, file$a, 404, 2, 24998);
    			attr_dev(div, "class", "text");
    			add_location(div, file$a, 5, 0, 106);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, p0);
    			append_dev(div, t1);
    			append_dev(div, p1);
    			append_dev(div, t3);
    			append_dev(div, p2);
    			append_dev(div, t5);
    			append_dev(div, p3);
    			append_dev(div, t7);
    			append_dev(div, p4);
    			append_dev(p4, t8);
    			append_dev(p4, em0);
    			append_dev(p4, t10);
    			append_dev(p4, em1);
    			append_dev(p4, t12);
    			append_dev(p4, em2);
    			append_dev(p4, t14);
    			append_dev(p4, em3);
    			append_dev(p4, t16);
    			append_dev(div, t17);
    			append_dev(div, blockquote0);
    			append_dev(div, t19);
    			append_dev(div, p5);
    			append_dev(div, t21);
    			append_dev(div, p6);
    			append_dev(div, t23);
    			append_dev(div, p7);
    			append_dev(div, t25);
    			append_dev(div, p8);
    			append_dev(div, t27);
    			append_dev(div, p9);
    			append_dev(div, t29);
    			append_dev(div, p10);
    			append_dev(div, t31);
    			append_dev(div, p11);
    			append_dev(div, t33);
    			append_dev(div, p12);
    			append_dev(div, t35);
    			append_dev(div, blockquote1);
    			append_dev(div, t37);
    			append_dev(div, p13);
    			append_dev(div, t39);
    			append_dev(div, p14);
    			append_dev(div, t41);
    			append_dev(div, blockquote2);
    			append_dev(div, t43);
    			append_dev(div, p15);
    			append_dev(div, t45);
    			append_dev(div, p16);
    			append_dev(div, t47);
    			append_dev(div, p17);
    			append_dev(div, t49);
    			append_dev(div, p18);
    			append_dev(div, t51);
    			append_dev(div, p19);
    			append_dev(div, t53);
    			append_dev(div, p20);
    			append_dev(div, t55);
    			append_dev(div, p21);
    			append_dev(div, t57);
    			append_dev(div, p22);
    			append_dev(div, t59);
    			append_dev(div, p23);
    			append_dev(div, t61);
    			append_dev(div, p24);
    			append_dev(div, t63);
    			append_dev(div, p25);
    			append_dev(div, t65);
    			append_dev(div, p26);
    			append_dev(div, t67);
    			append_dev(div, p27);
    			append_dev(div, t69);
    			append_dev(div, p28);
    			append_dev(div, t71);
    			append_dev(div, p29);
    			append_dev(div, t73);
    			append_dev(div, p30);
    			append_dev(div, t75);
    			append_dev(div, p31);
    			append_dev(div, t77);
    			append_dev(div, p32);
    			append_dev(div, t79);
    			append_dev(div, p33);
    			current = true;
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    		},
    		i: function intro(local) {
    			if (current) return;

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
    			if (detaching) detach_dev(div);
    			if (detaching && div_outro) div_outro.end();
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
    	validate_slots("Scarf", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Scarf> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ blur, linear: identity });
    	return [];
    }

    class Scarf extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Scarf",
    			options,
    			id: create_fragment$c.name
    		});
    	}
    }

    /* src/routes/pieces/SaintSisters.svelte generated by Svelte v3.32.3 */
    const file$b = "src/routes/pieces/SaintSisters.svelte";

    function create_fragment$d(ctx) {
    	let div;
    	let p0;
    	let t1;
    	let p1;
    	let t3;
    	let p2;
    	let t5;
    	let p3;
    	let t7;
    	let p4;
    	let t9;
    	let p5;
    	let t11;
    	let p6;
    	let t13;
    	let p7;
    	let t15;
    	let p8;
    	let t17;
    	let p9;
    	let t19;
    	let p10;
    	let t21;
    	let p11;
    	let t23;
    	let p12;
    	let t25;
    	let p13;
    	let t27;
    	let p14;
    	let t29;
    	let p15;
    	let t31;
    	let p16;
    	let t33;
    	let p17;
    	let t35;
    	let p18;
    	let t37;
    	let p19;
    	let t39;
    	let p20;
    	let t41;
    	let p21;
    	let t43;
    	let p22;
    	let t45;
    	let p23;
    	let t47;
    	let p24;
    	let t49;
    	let p25;
    	let t51;
    	let p26;
    	let t53;
    	let p27;
    	let t55;
    	let p28;
    	let t57;
    	let p29;
    	let div_intro;
    	let div_outro;
    	let current;

    	const block = {
    		c: function create() {
    			div = element("div");
    			p0 = element("p");
    			p0.textContent = "1. When your sister goes missing you are twenty-seven years old. She had\n    just turned thirty. One day she was there, the next day she was Gone. It was\n    three days before anyone realized; it happened on a Friday and she had just\n    moved to Wicklow Town. She was after nabbing a tidy number as the local\n    orthodontist, wearing tidy white scrubs and sorting people’s teeth into tidy\n    white rows. You usually rang her every evening, but she had been a bit of a\n    downer lately, what with the new town, new job, no friends. A manageable\n    downer though. Run of the mill stuff. No alarm bells. But you were tired,\n    and reluctant to take on her woes. Somewhere deep in the pit of your stomach\n    you know this is your fault. Your calls were the talisman that kept the Gone\n    at bay.";
    			t1 = space();
    			p1 = element("p");
    			p1.textContent = "2. The worst thing is that everyone around you expects life to go on, and\n    they expect you to go on too, so you do. Not because you think it’s right or\n    because you want to, but because you accede to their beliefs and are loath\n    to cause discomfort.";
    			t3 = space();
    			p2 = element("p");
    			p2.textContent = "3. Actuary /ˈaktʃʊ(ə)ri/ noun An actuary is someone that analyses data and\n    works with statistics, using mathematical skill to assess or predict the\n    probability of an uncertain future event.";
    			t5 = space();
    			p3 = element("p");
    			p3.textContent = "4. You’re the middle sister. You were three years younger than Becca; you\n    are three years older than Niamh. You never quite clicked with Niamh beyond\n    the dutiful clicking that comes with unavoidably shared genes and\n    reluctantly shared jeans. Niamh isn’t doing well. She’s a tightly coiled\n    spring over an open flame. She has a scalding tongue on her, ready to snap\n    at any stage. Her targetless anger floods out like waves of acid, burning\n    friends and family alike. On some level you know that she’s pushing out what\n    you’re turning in. She calls you Bean Uí Robot with a sneer on her lips. How\n    can you tell her that you’ve run out of responses? That you are sick of\n    receiving condolences for something that is not a death, not an ending.\n    Something that just goes on and on, forever and ever without end amen.";
    			t7 = space();
    			p4 = element("p");
    			p4.textContent = "5. MISSING PERSON REBECCA DALY 30 years old, medium build. Last seen on 25\n    November 2016. Wearing a navy coat with decorative patterns on the hem and\n    brown boots. If you have seen this woman or know of her whereabouts, please\n    contact Wicklow Garda Station – 0404 60140";
    			t9 = space();
    			p5 = element("p");
    			p5.textContent = "6. The Gardaí show you the CCTV footage, hoping you’ll have some insight\n    into Becca’s body language. You sit in the station and lean hungrily towards\n    the screen, watching the final minutes of your sister’s existence. The\n    camera is positioned over the Bank of Ireland, down the street from the\n    Mariner. The quality is poor, the picture in black and white. You watch\n    Becca walk out of the pub. Her face is an inscrutable blob of pixels. She’s\n    wearing her good blue coat, the one you described to the Gardaí and showed\n    them on the Zara website. The one they will later call navy in the official\n    missing person release. The coat is a dark shade of grey on the screen, but\n    it remains distinctive due to its decoration: a city silhouette airbrushed\n    on the hem. You know that coat, you know those boots. You know that\n    underneath she’s wearing her green dress and black tights. Her go-to\n    going-out outfit when she wasn’t going out out. The Gardaí won’t let you put\n    that on the posters. They’re apologetic, but they can only go on established\n    facts. You watch Becca walk down the street. You watch her turn the corner\n    and disappear. The tape continues for another twelve seconds. Twelve seconds\n    of total absence. Then the loop starts again and there is your sister,\n    walking out of the Mariner. You want to ask for a copy, but you stop\n    yourself. You know even then that nothing good can come from having it. It\n    would be nothing more than owning the final seconds of a grainy ghost\n    composed in monochrome. ‘Thirty can be a tough year for some women,’ the\n    Garda comments, and you think can it?";
    			t11 = space();
    			p6 = element("p");
    			p6.textContent = "7. There’s no such thing as a Missing Person’s Mass but there’s a Mass said,\n    nonetheless. When the priest says we’ll kneel now, everyone kneels. When the\n    priest says we’ll bow our heads now, everyone bows. The priest keeps saying\n    we’ll do this now and does none of it himself. The Eucharist is given out\n    and it sits dry and hard on your tongue. This is the anno domini of your\n    life, nothing will be the same after this.";
    			t13 = space();
    			p7 = element("p");
    			p7.textContent = "8. There’s no reason to believe she went to the sea, but you believe she\n    went to the sea.";
    			t15 = space();
    			p8 = element("p");
    			p8.textContent = "9. The official search lasts two months. That’s all it takes to write your\n    sister off from reality. Becca was always the neat one, the tidy one.\n    Whatever force made her Gone has respected that core aspect of her\n    personality. There is no body. There are no leads. From the outside it looks\n    as though she has been sliced from reality. Perhaps by a sharp scalpel, the\n    kind she boasted her prowess with when describing her more surgical\n    procedures. That’s how it looks, but that’s not the truth of it. The truth\n    is that her disappearance has left a messy, open wound. A torn hole in the\n    quintessential fabric of existence. Ragged edges and pumping blood. Your\n    family must learn to exist around this wound because you know it’s not the\n    kind that will heal. It’s the kind that stays open. Stays raw.";
    			t17 = space();
    			p9 = element("p");
    			p9.textContent = "10. Saint Anthony looks, Saint Anthony finds, Saint Anthony places in front\n    of my eyes.";
    			t19 = space();
    			p10 = element("p");
    			p10.textContent = "11. You studied to be an actuary and then realized about fifteen minutes\n    after qualifying that you fucking hated it. You work in a call centre these\n    days while trying to figure out what to do with your life. Your parents used\n    to give you a hard time about it. Not anymore. Not since they learned that\n    there are darker outcomes for daughters than unrealized potential. They are\n    so much older now, older than they were. More timid, as though they think\n    that pushing you would disrupt the delicate balance of whatever force\n    protects you from being Gone. They’re more affectionate. They call you\n    ‘pet’. Your lips press into a thin smile at each saccharine sentiment, as\n    though you’re making sure it doesn’t get into your mouth. The rotting\n    honey-juice of their guilt-sodden tenderness.";
    			t21 = space();
    			p11 = element("p");
    			p11.textContent = "12. Eight months later, on the first night you go out out, your friend’s\n    boyfriend rants about how much he hates his job. You sit with the group and\n    listen, your finger drawing tight little lines on the condensation of your\n    glass. It’s boring, he says. My boss is a gobshite, he says. I swear to god,\n    one more week and I’ll off myself, he says. There’s a brief susurration of\n    laughter before it fades into awkward silence, people’s eyes sliding to you.\n    You smile to cut the tension and continue to stockpile reasons why your\n    sister couldn’t have killed herself. You hate that you’re doing it. The\n    existence of the mental list you have curated seems to give weight to the\n    other side of the argument, the idea that there is a debate to be rebutted.\n    But you can’t stop, and though you never write it down, it is always a\n    single thought away, added to as appropriate. You begin to dream of the sea.\n    The crashing, roiling sea. Becca is down there somewhere and but for the\n    violence of the waves blocking her attempts to surface, she could come back.\n    You spend entire nights following winding paths down to the seashore, ready\n    to dive in and save her. You never make it. You always wake just as you\n    reach the crest of the sand dunes, the sound of the sea crashing in your\n    ears. The dreams don’t stop, so you start avoiding sleep. Instead you lie in\n    the dark and go through your list, running a mental finger down the smudged\n    and tattered page, worn from constant rehashing. You lie there, listening to\n    the sound of your boyfriend breathing. Your boyfriend who has no open wounds\n    in his life and keeps putting his hands over yours, trying to close it with\n    his clumsy fingers. Like he doesn’t know that some things just need to\n    fucking bleed.";
    			t23 = space();
    			p12 = element("p");
    			p12.textContent = "13. Say someone was in Wicklow Town on a Friday night, and they had a drink\n    at the Mariner. Say they were homesick and lonely and missing Dublin. Say\n    they wanted to leave. Say they wanted to go somewhere alone. Say they wanted\n    to go to the sea. First, they’d walk out of the bar, pulling their good blue\n    coat around their shoulders. They’d take a second to look down the dark\n    street, stained with autumnal spatterings of rain. Then they’d turn off to\n    the right, walking alone in the dark. Past the garishly painted Toymaster,\n    and past the Bank of Ireland. They’d turn right again, out of the scope of\n    the bank’s security cameras. They’d turn what’s locally known as the Long\n    Corner, onto a road with farther spaced streetlamps, puddles of darkness\n    gathering at set spaces. They’d walk on, past rows of houses predominantly\n    painted in shades of blue. They’d pass the Bridge Tavern, then cross the\n    River Vartry. They’d walk to the bit of town less preoccupied with looking\n    twee for tourists, its houses a more functional spackled brown. They’d walk\n    until they got to the low ones, the bungalows built in deference to sea\n    gales and salty winds. A six-minute walk and there they’d be. At the\n    endless, endless sea.";
    			t25 = space();
    			p13 = element("p");
    			p13.textContent = "14. When calculating the risks posed to a missing person, actuaries used to\n    use the classification method. Part One of the risk matrix dealt with\n    personal circumstances. It included factors like age, environment,\n    drug/alcohol dependency and isolation. Part Two examined the circumstances\n    of the disappearance. It included things like ‘out of character behaviour’\n    or ‘inclement weather conditions’. Each of these was awarded a single score\n    and could then be judged on a scale. This method is no longer used. It was\n    too easy to weigh circumstances heavier than they warranted. Too easy to\n    become embroiled into the personal details. Every case became a high-risk\n    case. Every case became important. The classification method was deemed\n    inefficient and abandoned.";
    			t27 = space();
    			p14 = element("p");
    			p14.textContent = "15. The Irish Times Tuesday 20 November 2018, 18:28 Gardaí issue Rebecca\n    Daly appeal two years after disappearance Supt Derek O’Mahoney calls for\n    those with information to come forward Gardaí have issued a new appeal for\n    information in relation to missing woman Rebecca Daly as her family prepares\n    to mark the second anniversary of her disappearance. Ms Daly (30) vanished\n    from the streets of Wicklow Town in the late hours of 25 November 2016. Her\n    disappearance from a relatively small town so close to Christmas was the\n    subject of a high-profile search and publicity campaign, but no trace was\n    ever found. A Bank of Ireland CCTV camera on Main Street, Wicklow recorded\n    her passing by at 11.20pm heading towards Bridge Street. Supt Derek\n    O’Mahoney is appealing for anybody with information to contact the Garda\n    Confidential line 1800 666 111 or any Garda Station. Ms Daly is described as\n    5ft 6ins, of medium build with blonde shoulder-length hair and brown eyes.";
    			t29 = space();
    			p15 = element("p");
    			p15.textContent = "16. Your boyfriend doesn’t leave, because imagine leaving. Leaving his\n    girlfriend with the missing sister. His girlfriend who has grown distant and\n    cold and still, like a lake frozen over in winter. That’s the only reason he\n    doesn’t leave and you know it. When it hits the two year mark you push him\n    out instead, and still manage to make him feel like it’s his fault. Grand,\n    you say. Fine. Fuck off with yourself. Your social circle is neatly halved.\n    You feel better for it.";
    			t31 = space();
    			p16 = element("p");
    			p16.textContent = "17. Niamh rings you one evening, while you’re examining your new\n    conditioner. You’re trying to go all natural, and you can’t remember whether\n    parabens are allowed. You answer the phone without thinking, and it’s only\n    after the pleasantries that you remember Niamh never calls. ‘I have to do a\n    Form 12 for Revenue,’ she says. ‘They sent me a letter.’ There’s something\n    about the way she says it that makes you hesitate, and that beat of silence\n    is enough to damage whatever was hanging in the balance. ‘Yeah, it’s fine,\n    never mind. I’ll ask Dad.’ Her voice sounds thick, her throat sounds raw,\n    and before you can say anything else, she hangs up. You feel bad for a\n    minute, but then the feeling fades. It is unfortunate that Niamh has lost\n    the sister who took care of her, but in fairness, so have you.";
    			t33 = space();
    			p17 = element("p");
    			p17.textContent = "18. In most fatal accident cases that make it to the High Court, an actuary\n    is brought in as an expert witness, to tally up the total loss to the\n    survivors. The losses incurred by the financial dependents of the deceased\n    are quantified under the following headings: • Loss of financial dependency\n    since the accident; • Loss of future financial dependency prior to\n    retirement; • Loss of future financial dependency after retirement; • Loss\n    of services provided by the deceased; • Accelerated value of deductible\n    assets passing on death. The actuary sits down with a calculator. They tot\n    up the total financial loss accumulated as a result of a person being taken\n    before their time. ‘Before their time,’ as though it’s possible to know when\n    that time is. Maybe there’s another kind of actuary. A tall figure draped in\n    seaweed and stinking of fish. A dark shadow who rises from the depths to\n    skulk the streets at night. Who watches us and records the tally marks that\n    the years carve into our bones. An actuary who, through some strange\n    arithmetic, decides when it is time.";
    			t35 = space();
    			p18 = element("p");
    			p18.textContent = "19. Becca had thick hair, chopped at an elegant length that circled her\n    neck. When she was working, she tied it back in a neat ponytail. It was\n    efficient hair, knowledgeable hair. Your hair is wild and thin and prone to\n    over-enthusiastic impressionist shapes. No matter how tight you tie it back\n    there are always escaping strands, tiny tendrils coiling and cajoling you\n    back to dreamland. One day, as you sit at your computer, fighting the\n    flailing strands into a bejewelled hairclip, a question occurs to you. Are\n    you the eldest sister now? Is that how it works? You wonder about your\n    parents. You wonder if your parents pause when they meet new people, if they\n    are asked about their children. You wonder if they say they have three\n    daughters or two. You get sick in the toilet at work. You swallow two\n    Panadol, willow-bark bitterness coating your tongue. Someone suggests you go\n    home early. You refuse. After all, it’s over two years since your sister\n    disappeared. You throw out the hairclip. Garish, shiny tat.";
    			t37 = space();
    			p19 = element("p");
    			p19.textContent = "20. A Mental List of Reasons Why Your Sister Couldn’t Have Killed Herself a.\n    She was thinking about getting a cat. b. She just bought, like, three\n    succulents. c. One week before she died, she bought the Sunday Riley Good\n    Genes Lactic Acid Treatment on the internet for £85.00, not including\n    shipping and when the pound to euro exchange rate was bad, so there’s no way\n    that would have been let go to waste. d. She was talking about taking up\n    guitar. e. It was too close to Christmas, she loved Christmas. f. When you\n    went to her apartment, after it was clear that this was serious, it was\n    clear that she was Gone, and you were enveloped in the scent of her,\n    surrounded by her things, you started picking through her drawers looking\n    for clues, and you opened her fridge and you looked inside and there was\n    half a cheesecake, and if you were going to kill yourself you would have\n    eaten the whole cheesecake and you and your sister are quite alike in\n    impulses and general temperament, or so you are told. g. She wouldn’t do\n    that. h. She just wouldn’t do that. i. She wouldn’t do that to you.";
    			t39 = space();
    			p20 = element("p");
    			p20.textContent = "21. One day, nearly three years later, you’re in the Penneys on Mary Street\n    and you’re not thinking about Becca at all. You meet an old neighbour of\n    your parents’, a woman whose sun-exposed skin reminds you of the last time\n    your father cooked duck – all puckered, oily, uneven brown. She’s been\n    living in Spain the last seven years, she says. Moved there when she\n    retired, just back to visit family. She asks you how your Mammy is. She asks\n    you how Niamh is getting on. She asks you how Becca is doing. The moment\n    when a drowning person takes an involuntary breath under water is known as\n    the ‘break point’. For a moment you think that this is it. This is the point\n    at which you break. Her mouth is still moving, but all you can hear is\n    muffled ringing, all you can feel is the rush of cold water against your\n    skin as you drown. You want to slap her for reminding you and you want to\n    slap her for being here and you want to slap her for not knowing. How can\n    she not know? But then you remember that life goes on. That the gaping\n    ragged hole only exists in your world. Even though it feels hateful to her\n    memory, you don’t want to talk about your missing sister here, while you’re\n    holding a jumpsuit reduced to €5 that’s a size too small but could be\n    aspirational. You don’t feel like you owe this woman enough to do that to\n    yourself, and so you dodge the question, change the subject. You move on.";
    			t41 = space();
    			p21 = element("p");
    			p21.textContent = "22. The Life Table is a table created by actuarial science which shows, for\n    each age, what the probability is that a person of that age will die before\n    their next birthday.";
    			t43 = space();
    			p22 = element("p");
    			p22.textContent = "23. Listen. Here is your secret: You still call Becca. You call Becca all\n    the fucking time. Her phone rang, the first couple of days during the\n    search. Then it stopped ringing and started going straight to voicemail.\n    It’s been three years and you can still remember the exact moment, the\n    electric shock that raced down your spine, the crashing wave of relief when\n    you heard her voice, thinking she’s okay, she’s okay before you realized.\n    You still ring her, listening to the careless trip of her words as she tells\n    you that You’ve reached Becca Daly. I can’t get to the phone right now but\n    leave a message and I’ll get back to you as soon as I can! It’s like a\n    promise, so you do. You ring her, you listen to her voice, and you leave her\n    a message. She’ll get back to you as soon as she can.";
    			t45 = space();
    			p23 = element("p");
    			p23.textContent = "24. The year you turn thirty is not a good year. Will this be the year that\n    you go missing? Snatched from the footpath, in the shadow between two\n    streetlights. Leaving no trace, leaving the world to go on without you after\n    the appropriate two months of searching and handwringing. That’s nonsense.\n    You won’t let it colour your decision making. It does anyway. You cancel\n    plans, curb the extent of your social presence, fail to renew subscriptions.\n    You’re due new glasses, and you put off the optometrist appointment because\n    you won’t need them when you’re Gone. You drink more. You’re alone more. The\n    strange tumour of a thought pertaining to your birthday, the idea that it\n    will fatefully and unavoidably be your last, comes with a righteous\n    indignation that tastes like tin. It comes with the idea that you are safe\n    until then. No dark shadow would dare snatch you up. Not yet. Not before\n    your time.";
    			t47 = space();
    			p24 = element("p");
    			p24.textContent = "25. ‘Finally the Immaculate Virgin, preserved free from all stain of\n    original sin, when the course of her earthly life was finished, was taken up\n    body and soul into heavenly glory, and exalted by the Lord as Queen over all\n    things, so that she might be the more fully conformed to her Son, the Lord\n    of lords and conqueror of sin and death.’ The Bodily Assumption of Mary,\n    Catechism of the Catholic Church, 966";
    			t49 = space();
    			p25 = element("p");
    			p25.textContent = "26. You agree to have your birthday party in Annascaul, your father’s\n    childhood town. Your parents are looking for a distraction; they want to\n    make it about family. You’re relieved to give the few friends you have left\n    an excuse not to attend. The festivities are held in Patcheen’s Pub, its\n    stone walls bedecked with balloons. Streamers hang between black and white\n    photos, over the glass case housing a taxidermy hare. There’s a buffet of\n    cocktail sausages and eggy sandwiches. Aunts and uncles and second cousins\n    all drink and laugh and dance furiously to the over-enthusiastic DJ who\n    keeps asking Are we all having a good tyyyyyme? You’re there to smile and\n    chat and slip away unnoticed around midnight. You’re not there to fight with\n    Niamh, but that’s what ends up happening. You watch her mouth as she screams\n    at you, tequila salt still clinging to her lips. She’s very drunk. You can’t\n    remember what the instigating incident was, the only thing you remember is\n    that she spat the words ‘She’s dead, not you’ so you slapped her. Hard. You\n    push past the inward rush of relatives and manage to slam your way into the\n    ladies. You pull a stall door closed and lock it, shaking hands pulling your\n    mobile from your purse. Hardly thinking, moving by muscle memory, your thumb\n    flicks open Contacts and taps Becca’s name. You make sure it’s ringing, and\n    then lift the phone to your ear. ‘Hello?’ Your heart might shatter your\n    ribs. ‘Becca?’ ‘No, sorry.’ A man’s voice. ‘Wrong number.’ The number is the\n    same. It’s been given away. You want your phone to shatter into a thousand\n    pieces. When you fuck it to the floor, you want it obliterated. Instead it\n    hits the tile with a sound like snapping plastic. It lands face up and you\n    see that the screen is now a mass of ugly jagged pieces. You know that’s\n    what you are. Splintered pieces of glass trying to stay together. When you\n    return to the party, they tell you that Niamh left. They tell you they can’t\n    find her. They tell you that your sister is Gone.";
    			t51 = space();
    			p26 = element("p");
    			p26.textContent = "27. ‘Oh my fuck. Are these all Niamh’s? Is this her MED1 paperwork? Becca!’\n    You’re going through the piles of papers on Becca’s desk in her living room.\n    She’s moving out of Dublin in three weeks, and her apartment is messier than\n    you’ve ever seen it. Higgledy piggledy, boxes and clothes on every surface.\n    ’Jesus Christ. You always do her forms for her, would you not just leave her\n    at it?’ ‘Ah but she gets fierce stressed.’ Becca is in her room getting\n    changed. Her voice carries over the low thump of music from the Bluetooth\n    speakers on the couch. ‘She’ll keep getting stressed if she’s allowed avoid\n    them,’ you snort, tossing the forms back on the table. ‘It’s just paperwork,\n    for fuck’s sake.’ ‘Come here, how do I look?’ Becca comes out. She’s going\n    out out, all red dress and dangly earrings. ‘Fuck me, does he know he’s\n    getting the ride?’ ‘It’s my goodbye tour of Dublin, I’d say he knows all\n    right.’ You shriek with laughter and throw a pillow at her. ‘A goodbye tour\n    means visiting the fucking landmarks, not doing a round on every fella\n    you’ve shifted in Coppers!’ Becca takes a drink of red wine from her glass\n    and is left with two curled lines coming up from her bottom lip, giving her\n    grin a devilish cast. A month ago, she went blonde. Objectively, it suits\n    her, but you still prefer her dark. ‘Sure, I’m thirty now. I have to engage\n    in a bit of debauchery before moving to the backarse of nowhere. Drowning in\n    the boredom of adulthood.’ ‘Lovely.’ You rub the sides of your mouth with\n    your forefinger and thumb, flagging the wine marks. She takes the hint and\n    wipes, peering in the mirror to ensure her face is unmarred. Then she pulls\n    her phone from her bag. ‘Fuck. My taxi is here. Can you lock up on your way\n    out?’ ‘Yeah, no bother. Enjoy yourself!’ ‘Say a prayer to St. Jude!’ She’s\n    halfway out the door, coat pulled on, dangly earrings brushing her fragrant,\n    powdered cheeks. ‘Patron saint of lost causes!’ you both chorus, and you’re\n    laughing as she closes the door behind her.";
    			t53 = space();
    			p27 = element("p");
    			p27.textContent = "28. You can taste bile and saltwater in your mouth as your car bumps and\n    dips along the narrow rural roads. You shouldn’t be driving; you’ve had\n    three glasses of wine. Maybe more, by the way it’s creeping up the back of\n    your throat. You’ve developed the habit of counting seconds in sets of\n    twelve when the world gets overwhelming. Over and over. You’re counting now,\n    as you drive a little too fast and take turns a little too hard. You have no\n    idea where Niamh has gone but you drive to the sea, feeling like you’re\n    dreaming, feeling like this is the end of all the dreams. This is where it\n    ends, and you will either be Gone by morning (before your time) or nothing\n    will happen at all. No other options. Because it was meant to be you. It was\n    meant to be you, and you will not do this again. You will not lose the other\n    half of your heart.";
    			t55 = space();
    			p28 = element("p");
    			p28.textContent = "29. Saint Anthony looks, Saint Anthony finds, Saint Anthony places in front\n    of my eyes.";
    			t57 = space();
    			p29 = element("p");
    			p29.textContent = "30. The car that your sister shouldn’t have driven is parked at an angle on\n    Inch Beach. The door is open, the headlights are on. Niamh isn’t inside, but\n    you spot her silhouette in the distance, illuminated by the beams. She may\n    be the youngest, but she’s also the tallest. When she was a teenager\n    learning to walk in heels, you watched her long coltish legs wobble as they\n    picked out safe paths. She’s going to the sea. Niamh doesn’t hear your\n    engine over the sound of the waves, doesn’t turn as you stumble from the\n    car. You are far, far behind her, so you have to run and run and run as she\n    walks, slow and with purpose. The sound of the crashing water is loud enough\n    that she doesn’t hear your bare feet thudding on the sand until the last\n    second – you don’t remember taking off your heels – half-turning to you as\n    your bodies collide and her hair is in your mouth and the filmy material of\n    her dress (an out out outfit) is gripped in your fist as you knock her to\n    the ground, you hold her down, and you keep her Here. ‘Let me go!’ she\n    screams, thrashing beneath you, voice ragged and wet and broken. There’s\n    sand on her lips. The words come from her throat in a drawn out, jagged\n    wail. A child’s cry of pure misery. ‘Let me go!’ You don’t let her go. The\n    sound of the waves is a smooth, repeating rumble. Nothing like the sharp\n    fractured crashes of your dreams. You hold your sister. You are thirty years\n    old.";
    			add_location(p0, file$b, 10, 2, 269);
    			add_location(p1, file$b, 23, 2, 1086);
    			add_location(p2, file$b, 29, 2, 1362);
    			add_location(p3, file$b, 34, 2, 1577);
    			add_location(p4, file$b, 47, 2, 2441);
    			add_location(p5, file$b, 53, 2, 2739);
    			add_location(p6, file$b, 77, 2, 4422);
    			add_location(p7, file$b, 85, 2, 4879);
    			add_location(p8, file$b, 89, 2, 4990);
    			add_location(p9, file$b, 102, 2, 5841);
    			add_location(p10, file$b, 106, 2, 5950);
    			add_location(p11, file$b, 119, 2, 6789);
    			add_location(p12, file$b, 145, 2, 8633);
    			add_location(p13, file$b, 164, 2, 9924);
    			add_location(p14, file$b, 177, 2, 10741);
    			add_location(p15, file$b, 192, 2, 11770);
    			add_location(p16, file$b, 201, 2, 12286);
    			add_location(p17, file$b, 214, 2, 13144);
    			add_location(p18, file$b, 231, 2, 14288);
    			add_location(p19, file$b, 247, 2, 15371);
    			add_location(p20, file$b, 264, 2, 16532);
    			add_location(p21, file$b, 285, 2, 18019);
    			add_location(p22, file$b, 290, 2, 18217);
    			add_location(p23, file$b, 303, 2, 19066);
    			add_location(p24, file$b, 318, 2, 20033);
    			add_location(p25, file$b, 326, 2, 20479);
    			add_location(p26, file$b, 355, 2, 22599);
    			add_location(p27, file$b, 384, 2, 24720);
    			add_location(p28, file$b, 398, 2, 25622);
    			add_location(p29, file$b, 402, 2, 25731);
    			attr_dev(div, "class", "text");
    			add_location(div, file$b, 5, 0, 106);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, p0);
    			append_dev(div, t1);
    			append_dev(div, p1);
    			append_dev(div, t3);
    			append_dev(div, p2);
    			append_dev(div, t5);
    			append_dev(div, p3);
    			append_dev(div, t7);
    			append_dev(div, p4);
    			append_dev(div, t9);
    			append_dev(div, p5);
    			append_dev(div, t11);
    			append_dev(div, p6);
    			append_dev(div, t13);
    			append_dev(div, p7);
    			append_dev(div, t15);
    			append_dev(div, p8);
    			append_dev(div, t17);
    			append_dev(div, p9);
    			append_dev(div, t19);
    			append_dev(div, p10);
    			append_dev(div, t21);
    			append_dev(div, p11);
    			append_dev(div, t23);
    			append_dev(div, p12);
    			append_dev(div, t25);
    			append_dev(div, p13);
    			append_dev(div, t27);
    			append_dev(div, p14);
    			append_dev(div, t29);
    			append_dev(div, p15);
    			append_dev(div, t31);
    			append_dev(div, p16);
    			append_dev(div, t33);
    			append_dev(div, p17);
    			append_dev(div, t35);
    			append_dev(div, p18);
    			append_dev(div, t37);
    			append_dev(div, p19);
    			append_dev(div, t39);
    			append_dev(div, p20);
    			append_dev(div, t41);
    			append_dev(div, p21);
    			append_dev(div, t43);
    			append_dev(div, p22);
    			append_dev(div, t45);
    			append_dev(div, p23);
    			append_dev(div, t47);
    			append_dev(div, p24);
    			append_dev(div, t49);
    			append_dev(div, p25);
    			append_dev(div, t51);
    			append_dev(div, p26);
    			append_dev(div, t53);
    			append_dev(div, p27);
    			append_dev(div, t55);
    			append_dev(div, p28);
    			append_dev(div, t57);
    			append_dev(div, p29);
    			current = true;
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    		},
    		i: function intro(local) {
    			if (current) return;

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
    			if (detaching) detach_dev(div);
    			if (detaching && div_outro) div_outro.end();
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
    	validate_slots("SaintSisters", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<SaintSisters> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ blur, linear: identity });
    	return [];
    }

    class SaintSisters extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SaintSisters",
    			options,
    			id: create_fragment$d.name
    		});
    	}
    }

    /* src/routes/pieces/Electric.svelte generated by Svelte v3.32.3 */
    const file$c = "src/routes/pieces/Electric.svelte";

    function create_fragment$e(ctx) {
    	let div;
    	let div_intro;
    	let div_outro;
    	let current;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "‘Before getting the electric, we had no running water, no refrigeration, no\n  machine for washing. We were bound to daylight hours. Electricity meant parish\n  hall dances and colour and fun. It was a release from the drudgery. It meant\n  we could finally see ourselves.’ Getting the Electric Louise Hegarty The first\n  induction coil was invented in 1836 by Nicholas Callan, a priest and scientist\n  from Louth. This early form of transformer contributed greatly to the\n  widespread distribution of electricity throughout the world. The advantages of\n  electricity to the agricultural industry and the day-to-day lives of farmers\n  would be undeniably immense. It would lead to an improvement in hygiene and\n  safety standards, the simplifying of many daily tasks and a rise in\n  efficiency, which would result in greater profits. It would also make rural\n  Ireland an attractive site for new industries. It is imperative therefore that\n  such a scheme begins without further delay. - 'Electricity in Rural Ireland'\n  by A. Byrne published in Muintir na Tíre (Issue 22, March 1929, p.8) Thomas\n  McLaughlin (1896 - 1971) was born in Drogheda. After studying in UCD and UCG,\n  McLaughlin moved to Berlin in 1922 to work for the German electrical\n  engineering company Siemens-Schuckert. He returned to Ireland in December 1923\n  where he became one of the key figures in the Shannon hydroelectric scheme. He\n  later became the executive director of the EBS. In Cavan there was a great\n  fire, Judge McCarthy was sent to inquire, It would be a shame, if the nuns\n  were to blame, So it had to be caused by a wire. - Flann O’Brien & Tom\n  O’Higgins In our country, electrification is more than merely producing light\n  or power. It is bringing light into darkness… we are going to put into the\n  homes of our people in rural areas a light which will light up their minds as\n  well as their homes. If we do that, we will have brought a new atmosphere and\n  a new outlook to many of these people. - James Larkin Jnr, TD, speaking during\n  the Second Stage debate on the Electricity Supply (Amendment) Bill, 1944 8 The\n  Rural Area Organiser was an important figure in developing the relationship\n  between the ESB and local people. The job involved encouraging householders to\n  sign up to the scheme as well as advising on the purchase of electrical\n  appliances. AN ACT TO MAKE PROVISION FOR THE FORMATION AND REGISTRATION OF A\n  COMPANY HAVING FOR ITS PRINCIPAL OBJECTS THE ACQUISITION, ERECTION, AND\n  OPERATION OF SUGAR FACTORIES IN SAORSTÁT ÉIREANN, AND TO PROVIDE FOR THE\n  ACQUISITION BY THE MINISTER FOR FINANCE OF SHARE CAPITAL OF SUCH COMPANY, FOR\n  THE GIVING OF GUARANTEES BY THE STATE IN RELATION TO DEBENTURES ISSUED BY SUCH\n  COMPANY, FOR THE COMPULSORY ACQUISITION OF LAND AND THE CONSTRUCTION,\n  MAINTENANCE, AND OPERATION OF TRANSPORT WORKS BY SUCH COMPANY, AND FOR OTHER\n  MATTERS CONNECTED WITH THE MATTERS AFORESAID. [23rd August, 1933.] Once upon a\n  time there was a man and a woman who lived with their two children—a girl and\n  a boy—on a small farm. Beside their house was a fairy fort. The woman was\n  pregnant with a child and late one night she gave birth to a little boy. They\n  warned the two older children never to leave the window to the bedroom open in\n  case a fairy entered and took the baby, who was vulnerable… - The Changeling\n  transcribed by a member of our volunteer transcription project, duchas.ie … I\n  hope to see the day that when a girl gets a proposal from a farmer she will\n  inquire not so much about the number of cows, but rather concerning the\n  electrical appliances that she will require before she gives her consent,\n  including not merely electric light but a water heater, an electric clothes\n  boiler, a vacuum cleaner and even a refrigerator. - Minister Seán Lemass\n  speaking during the Second Stage debate on the Electricity Supply (Amendment)\n  Bill, 1944 Customs-Free Airport Act, 1947 2.—(1) The Minister, with the\n  concurrence of the Minister for Finance, may by order declare that, on and\n  after a specified date, the land enclosed within the limits defined by the\n  order shall be the Customs-free airport for the purposes of this Act. (2) The\n  Minister, with the concurrence of the Minister for Finance, may from time to\n  time by order amend the order under subsection (1) of this section by varying\n  the limits of the airport. (3) The airport shall comprise only land which for\n  the time being belongs to the State. What does rural electrification mean to\n  you? How can you get it to your house and farmyard? The switching on ceremony\n  was an important part of the process and generally featured a dance, a dinner\n  and speeches from local politicians, members of the clergy and representatives\n  of the ESB. - Switching on: A History of Rural Electrification in Ireland by\n  John Swanzy (Mweelrea Press, 2016) Virginia O’Brien (1898 - 1988) was the\n  longest serving chairwoman of the Irish Countrywomen’s Association. During her\n  lifetime she witnessed significant changes in the lives of rural Irish people:\n  the advent of independence, the rural electrification scheme and membership of\n  the EEC. She was married to Frank O’Brien until his death and they had five\n  children together. This is the tenth issue of the staff magazine and we are\n  now well into the swing of things. We have completed at least one area in each\n  county with some counties already having completed two or three. Before the\n  end of this year we will be adding another five construction crews to the ten\n  already working in the field. Shortly, we will also be increasing the number\n  and variety of appliances available in our showroom - Editor’s Letter, REO\n  News (vol. 10, September 1948, p1) A backslider was a householder who had\n  initially signed up for the electricity scheme but who changed their minds\n  once crews arrived. THE REPUBLIC OF IRELAND ACT, 1948 AN ACT TO REPEAL THE\n  EXECUTIVE AUTHORITY (EXTERNAL RELATIONS) ACT 1936, TO DECLARE THAT THE\n  DESCRIPTION F THE STATE SHALL BE THE REPUBLIC OF IRELAND, AND TO ENABLE THE\n  PRESIDENT TO EXERCISE THE EXECUTIVE POWER OR ANY EXECUTIVE FUNCTION OF THE\n  STATE IN OR IN CONNECTION WITH ITS EXTERNAL RELATIONS. [21ST DECEMBER, 1948]\n  BE IT ENACTED BY THE OIREACHTAS AS FOLLOWS:— Each area was canvassed in order\n  to assess interest and need and to promote the benefits of electricity. A\n  majority needed to sign up to the scheme in order for it to proceed. Showrooms\n  were opened so that electrical appliances could be demonstrated to the public.\n  Routes were surveyed, budgets were drawn up and then the erection of\n  electricity poles began. - Swanzy, ibid. The key-note of Electric Water-\n  Heating is simplicity. There is no complicated ritual of turning handles at\n  the psychological moment – you just turn the hot water tap. ‘They were young\n  men. They looked like my grandsons. But they did the job well. There was a lot\n  of interest from everyone and we would all go out to watch them erect poles\n  and string cables. My wife would bring them cups of tea and slices of warm\n  brown bread.’ You will want a light on in every room. Place it so as to give\n  the best light where you need it most. In some cases you might want two or\n  more lights. Make sure that your staircase light can be switched on or off\n  from either the foot of the stairs or the landing. The switching on ceremony\n  will take place from 8 o’clock on Tuesday night the 14th of October in the\n  parish hall. There will be a blessing from Father Aherne and opening speeches\n  from Mrs O’Brien of the ICA and Mr Geary of the ESB. The switching on will\n  happen at half past nine sharp. Following this there will be a dance with\n  music provided by the West Coast Showband. PUBLIC NOTICE Transcript of\n  recording made as part of a local history project: Once it was dark and the\n  speeches were over, we put out the paraffin lights and candles and the local\n  priest switched on the big metal switch and then everything was bright. Myself\n  and Davey ran out into the street and all the streetlights were on and we\n  could run around in the dark. And we could see the lights all over, up the\n  hills and far away. The fields twinkled. When we came back, we sneaked a small\n  bit of porter and danced and got shouted at because we trampled on the\n  marigolds. Supply will be given to whole areas. An ‘area’ should be about 25\n  sq. miles. A parish or creamery district might conveniently form the basis of\n  such an area. Statement of evidence of Garda ________ of An Garda Síochána\n  made on the 16th October 1948. I hereby declare this statement is true to the\n  best of my knowledge and belief and I make it knowing that if it is tendered\n  in evidence I will be liable to prosecution if I state in it anything which I\n  know to be false or do not believe to be true. I was called to a house at\n  ______ at 12:05am on the 15th of October 1948. I spoke with a man there who I\n  know to be ___________ who resides at the residence with his wife, _______,\n  his three children and his mother-in-law. He informed me that his infant child\n  had gone missing from the house. He and his wife had been at the parish hall\n  and had returned to the house at approximately 11:20pm. He says that his\n  mother-in-law was in the house with the children while they were out and that\n  she was asleep in the back kitchen when they returned. They went upstairs to\n  check on the children and found that the youngest ______ was missing. They\n  searched the house, but he could not be found. His wife then left the premises\n  to see if he had maybe wandered into the street and he followed her. The child\n  is 2 years old and was wearing blue and white pyjamas when he went to bed. He\n  has light brown hair and blue eyes. This statement has been read over by me\n  and is correct. The entire village came out to search in laneways and ditches\n  and neighbours’ gardens and fields and graveyards. But nothing. And no-one had\n  seen anything of course because everyone had been at the switching on\n  ceremony. There was no sign of anyone having gained entry to the house. The\n  old woman downstairs never woke. The other children remained asleep in their\n  beds. It was as if the child had just disappeared into thin air. - The Village\n  in the Dark by JB Duane (New Editions, 1995) The weather has been difficult in\n  recent weeks for crews working in the West and Northwest, which has meant that\n  we are slightly behind schedule. More workers will be sent to help these crews\n  catch up. - Editor’s Letter, REO News (vol 12, November 1948, p.1) HOLY HOUR\n  TO PRAY FOR VOCATIONS on the 24th of October from 3 o’clock to 4 o’clock. All\n  are welcome—prayer followed by tea and biscuits. ANNUAL COLLECTION FOR CHARITY\n  at all Masses during November. SPECIAL MASS to be held this Sunday for the\n  _____ family. Prayers will be said for the safe return of their young boy.\n  ‘Apparently she left the front door unlocked and her mother asleep downstairs.\n  The older children didn’t even wake up. Someone snuck in and took the baby.\n  And I feel terrible for them. I do. But they were very careless. Leaving the\n  children like that to go out drinking and dancing.’ Statement of _______ of\n  _______, ______ taken on the 15th of October 1948 at _________ by Garda\n  ________. We, my wife _______ and I, saw ______ running through the street. We\n  were on our way back from the switching on ceremony. I had consumed three\n  drinks and my wife one. We were taking our time. We were admiring the new\n  streetlights. Then we heard a woman screaming and crying and my wife said, ‘is\n  that ______?’ She knows her from the ICA. And the woman was knocking on doors\n  and was very distressed. We started to walk over to her and then her husband\n  appeared and caught up with her and held her. We went to check that things\n  were okay but obviously they weren’t. I went back to the parish hall to alert\n  Garda ________ and he accompanied me back to the street. This statement has\n  been read over by me is correct. Statement of __________ of ___________. I\n  hereby declare this statement is true to the best of my knowledge and belief\n  and I make it knowing that if it is tendered in evidence I will be liable to\n  prosecution if I state in it anything which I know to be false or do not\n  believe to be true. I noticed a man in the village in the days before the\n  disappearance of the young boy. I didn’t recognise him, which is unusual\n  because we all know each other around here. He was about 5’10” with long dark\n  hair. He was wearing a brown jacket and dark coloured pants. He didn’t seem to\n  have washed in a couple of days. Some people may think of electricity in the\n  home as a luxury to provide comfort in various ways. This is to some extent\n  true, but no housewife will need much propaganda to convince her that its\n  labour-saving value in the domestic sphere is unchallengeable. An electric\n  kettle will boil 12 pints of water for 1d. If you compare this with any other\n  method of boiling water you will find that it is considerably cheaper and it\n  is just as quick as any other method. Transcript of recording made as part of\n  a local history project: … And then another little boy was snatched. God love\n  us and save us. I remember praying for his parents every night. They were good\n  people. Myself and Máire joined the search and we hoped that we would find\n  something—a clue, some hope—but of course we didn’t. The village was very\n  glum. ‘Most of these cases… you should look at a member of the family. That\n  elderly woman, I never see her out and about. She stays inside always. I\n  wonder if something…’ DATE MISSING: SUNDAY 5TH DECEMBER 1948 18-MONTH-OLD BOY:\n  SEÁN HAIR COLOUR : BLONDE EYE COLOUR: LIGHT BLUE LAST SEEN AT 11 O’CLOCK\n  SUNDAY MORNING IN THE FRONT GARDEN OF HIS HOME DRESSED IN CREAM TOP AND\n  BOTTOMS PLEASE ALERT THE GARDAÍ IF YOU HAVE ANY INFORMATION Gardaí are\n  investigating whether there is any connection between the abductions of two\n  infant children from the same area. No-one has yet been arrested in relation\n  to the disappearances, but the Gardaí have started re-interviewing people in\n  the locality. They are specifically looking to speak to anyone who was on New\n  Road on the morning of the 5th of December. - ‘Gardaí investigate link in\n  missing child cases’ An Iar-Nuacht (7th December 1948) APPEAL FOR INFORMATION\n  - MISSING PERSON A Garda source has informed An Iar-Nuacht that they have\n  ruled out the involvement of any ESB workers or electricians in the recent\n  disappearance of a two-year-old boy. It had been reported that the Gardaí were\n  eager to speak to anyone who had been in the boy’s home in the days prior to\n  his abduction but these men have now been officially discounted as suspects. -\n  ‘No connection between ESB and missing child’ An Iar-Nuacht (20th October\n  1948) ‘I don’t think that little boy ever left that house’ Statement of\n  ________ of _______. I hereby declare this statement is true to the best of my\n  knowledge and belief and I make it knowing that if it is tendered in evidence\n  I will be liable to prosecution if I state in it anything which I know to be\n  false or do not believe to be true. ________ admitted to me that he had taken\n  the boy one night in ________ pub. He laughed about it. We had consumed three\n  pints between Everybody here today has been deeply affected by the\n  disappearance of the poor boy who was baptised in this very church. We will\n  pray for his parents and for his siblings and for his wider family. We pray\n  also for friends and neighbours, for the Gardaí and the volunteers who have\n  been searching tirelessly to bring Seán back home. - Homily of parish priest\n  After the disappearance of the second boy, the Gardaí came under increasing\n  pressure to make an arrest. After interviewing and fingerprinting the adult\n  population of the village they set their sights on the more likely of\n  suspects: a labourer or drifter. They sought out men who had been known to be\n  working or travelling through the area and tried to connect any of them to the\n  two disappearances. - Missing: Ireland’s Vanished Children by Sorcha Cahalane\n  (W&A Publishing, 2001) LITIR UM THOGHCHÁIN An bhfuil tú cráite le polaiteoirí\n  élite? Stop ag vótáil do FG, FF, Clann na Poblachta, LAB. Tabhair do vóta don\n  iarrthóir neachspléach. Tabhair do vóta don iarrathóir fíor-Ghaelach. •\n  Geallaim díobh 32-contae Éire aontaithe. Áit a bhfuil COSC ar an teanga\n  Béarla. • Bac ar fhrithchléireachas. • Táim réidh chun troid ar leith na\n  daoine. • Bac ar cistiú poiblí na páirtí politíochta. • Bac ar an\n  gCummanachas. • Tá sé soiléir san am atá inniú ann nach bhfuil meas againn ar\n  saol an duine. Tá sé tabhachtach ansan go bhfuil ionadaí againn a bhfuil sásta\n  troid ar son cearta daoine ó bhreith go bás nádúrtha. Tabhair do Vóta Uimh. 1\n  do Séan F Verrity. Statement of ________ of ________ . I hereby declare this\n  statement is true to the best of my knowledge and belief and I make it knowing\n  that if it is tendered in evidence I will be liable to prosecution if I state\n  in it anything which I know to be false or do not believe to be true. I was\n  woken up one night just before the second child was taken—I think it was\n  Monday—by the sound of a car outside. I am a light sleeper. My wife didn’t\n  wake. I went to the window. I didn’t recognise the car. It just stopped in the\n  middle of the road with the engine running. No-one got in or out and then\n  after about five minutes it just drove off. Extract from Garda report dated\n  the 20th of December 1948: The man said that he was at home with his wife on\n  the night in question. They live in _________. He says that he may have come\n  through the village before, but he couldn’t remember. He says that he earns\n  money doing odd jobs for people and travels about a lot. … for Paraic,\n  electricity means he can check on his animals early in the mornings or in the\n  dark winter evenings with ease. He reckons he will increase his profits by at\n  least 15% this year due to the increase in work he is able to… - Extract from\n  radio documentary on the rural electrification scheme (October 1952) ‘My\n  mother saved up her egg money to buy a brand new oven. We had a nice smart\n  girl come to the house to demonstrate it for my mother. She made some brown\n  bread to make sure the oven was working. She had a lovely dress on, and her\n  hair was back from her face and I still think of it now every time I smell\n  brown bread baking.’ I liked the cooker the best and I liked looking in all\n  the cupboards. I liked how shiny and new everything was. They let us plug in\n  some of the appliances to see how they worked. - Extract from an essay written\n  by a schoolchild for a competition run by the ICA 2 SMALL BOYS MISSING AND yET\n  NOTHING IS DONE THEIR aRE ThINGS THE GOVERNMENT DON’T WANT U TO NO. THeIR ARe\n  MONSTERS IN THE ELICTRICS THEir TAKING ARE CHILDREN. We NEED TO PRTECT ARE\n  FaMILies WE are BECOMIGN sick and tired ARE CHILDREN ARE SICK BECAUSE O THEM\n  lord GOD HeLP US ALL We have been thinking a lot lately about the real\n  real-life affect our work has on people’s day-to-day lives. We have seen it\n  already: housewives who now have more time for their hobbies, farmers who have\n  increased production. And we also like to believe that we have improved the\n  quality of people’s lives outside the realm of work… - Editor’s Letter, REO\n  News (vol 16, March 1949, p.1) The middle-aged labourer who was arrested in\n  connection with the recent disappearances of small children has been released\n  without charge. Since October of last year two infants have been abducted from\n  areas in the west of the country. No other arrests have been made. - ‘Man\n  released without charge in baby-napping cases’ An Iar Nuacht (30th March 1949)\n  One socket in every room is now regarded as essential for convenient living -\n  with two or three in some locations. The initial connection between the\n  disappearances and the introduction of electricity was unwittingly made by An\n  Garda Síochána themselves. In the days before the first abduction two\n  electricians had been in the boy’s house installing appliances. Gardaí\n  interviewed these two men but they both had alibis for the night in question.\n  They were completely ruled out as suspects but that tinge of doubt around the\n  ESB never fully left the minds of some villagers. - Duane, ibid. PRESENT\n  MINISTER O’REILLY, CLLR O’DONOVAN, CLLR Ó MEALÓID, CLLR HIGGINS, CLLR\n  SINCLAIR, CLLR LYNCH, CLLR HACKETT, CLLR McGRATH, CLLR MULLANE, CLLR TWOMEY,\n  CLLR SCANLAN, CLLR PHILPOTT, CLLR FRANKS, CLLR Ó BRAONÁIN AND REPRESENTATIVES\n  OF THE ESB APOLOGIES Cllr Mullins, Cllr O’Brien, Cllr Hynes, Cllr O’Sullivan\n  CONFIRMATION OF MINUTES Minister O’Reilly spoke about the need for calm heads.\n  He expressed regret and concern for the families of the missing boys. He\n  introduced Mr Geary of the ESB to speak directly about the safety of\n  electricity in homes. Mr. F Higgins circulated information to the members on\n  the proposed budget. NOTICES OF MOTION To approve the draft deed of mortgage\n  to provide a loan for the completion of O’Mahony Park. Advice to parents: •\n  Make sure that your doors and windows are locked and bolted • Do not allow\n  your children out after dark or to play on their own • All children need to be\n  supervised on their way to and from school • Please alert the Gardaí to any\n  suspicious activity COMHAIRLE CHONTAE MINUTES OF JUNE MONTHLY MEETING OF\n  COUNTY COUNCIL HELD IN ÁRAS AN CHONTAE, ON 10TH APRIL 1949 AT 2.00 P.M.\n  Extract from Garda report dated the 14th of April 1949: The woman believed\n  that the child was not hers. She said that he had been swapped with another\n  child. She wanted us to take the boy into care and to issue a missing persons\n  report for her own child. She seemed to be under the impression that something\n  —‘a fairy’—had got into the house through the electricity cables and had taken\n  her child and swapped him for ‘a changeling’. This morning, the head of the\n  ESB was being asked to clarify comments he reportedly made at a private\n  luncheon over the weekend in which he described those who refused electricity\n  as ‘backwards’ and ‘idiots’. - Radio Éireann (8th May 1949) A group of men\n  arrived at ESB headquarters in Athy yesterday morning to deliver a letter on\n  behalf of the village of D_____. The area has recently suffered a number of\n  unsolved abductions of children and these men believe that the ESB have a case\n  to answer. Some local villagers have linked the disappearances to the recent\n  switching on of electricity in the area. The ESB had no comment to make. -\n  Translation from Raidió na Gael broadcast (17th April 1949) I would like to\n  bring the Minister’s attention to the very worrying case of two missing\n  children in _ ____. I have been speaking to local people there in recent weeks\n  who say they feel they have been forgotten about. There now appears to be only\n  three fulltime Gardaí working on the case. There has been little to no\n  reassurance from the authorities. It seems to me that the Government has\n  abandoned the people of _____. Will there be any justice? Can the Minister\n  tell me what he is planning to do? - Oral Questions in the Dáil (18th April\n  1949) EXTRACT FROM REPORT BY HEALTH BOARD INTO OUTBREAK OF CERTAIN SYMPTOMS IN\n  ______, JANUARY - MAY 1949: We have compiled a list of people who have\n  reported to their General Practitioner any symptoms that did not have an\n  obvious cause. These symptoms include headaches, vomiting, stomach cramps,\n  tingling, numbness, burning and chest pain. The following list is a sample: •\n  A 45-year-old woman who reported sudden occasions of vomiting and experiencing\n  headaches after using her electric cooker. • A teenage girl who described\n  having stomach cramps, headaches and nausea, which were not alleviated by any\n  pain-relieving medication or anti-inflammatories. • A 21-year-old man who had\n  experienced tingling in his extremities and weakness in his upper arms which\n  got better when he was outdoors. • A 52-year-old man who was found outside his\n  home tearing his clothes off because he said that there were wires in them. •\n  A 10-year-old boy who had a high fever and numbness in the extremities. • Two\n  sisters aged 18 and 20 who complained of debilitating pain in their left upper\n  abdomen with no obvious reason for said pain. • A 60-year-old woman who stated\n  that her neighbours were playing tricks on her using electricity. • A woman in\n  her mid-forties who said she was ‘full of electricity’ and who was kept up at\n  night by the sound of men digging in her cellar and laying electric wires. Ó\n  Murchú, Paraic suddenly on 23rd of April 1949. Much loved by his wife Rose.\n  Cremation Saturday. No Flowers. The three-year-old girl who was declared\n  missing early this morning has been found and returned home to her parents\n  safe and sound. It seems that the child wandered off while shopping with her\n  family and… - Translation from Raidió na Gael broadcast (20th April 1949) You\n  would barely recognise the village now we are so suspicious and untrusting. I\n  find myself crossing the road to avoid people. I keep my head down to avoid\n  making eye contact. We do not know our neighbours anymore like we should. I\n  want to be more open, but we all have that lingering doubt in our minds. The\n  Guards are telling us that it is most likely a drifter, an outsider but it\n  could still be one of us. One of us could have kidnapped these children and\n  done… Oh, I can’t bear thinking about it. What would anyone want with those\n  poor boys? Couldn’t they have just left us alone? And the Guards have no\n  leads, no suspects. For a while, we had several Gardaí stationed here. We\n  would see them on their beat and they would give us comfort, but now we see\n  them less and less. They are slowly forgetting us. They want to forget us.\n  This is a crime that will never be solved, and they want rid of it. - Extract\n  from letter dated 18th April 1949, found in the apartment of the late Ms Julia\n  O’Keeffe of New York City Electricity is the safest form of power available\n  for both domestic and commercial use. Electricity poles and cables are\n  organised and installed by highly trained workers and the wiring of your house\n  and farm can only be done by a trained electrician. Rest assured, you and your\n  family are safe with electricity in the home. If you still have doubts, please\n  visit our showroom where we will demonstrate various electrical appliances and\n  give advice on what is best for you and your home. Two thousand people marched\n  yesterday to bring national attention to what they believe is the mishandling\n  of an investigation by the Gardaí into the disappearance of two infant\n  children in the same area over a six-month period. The protesters are\n  demanding an inquiry into the alleged mishandling of the matter by\n  authorities. - ‘Protesters Demand Answers’, The Irish Times (29th April 1949)\n  Electric Water-Heating is peculiarly suitable for use in doctor’s and\n  dentist’s surgeries owing to the ease of economy of installation, the\n  simplicity and cleanliness of operation, and the complete absence of fumes and\n  odours Virginia O’Brien, Chairperson of the Irish Countrywomen’s Association,\n  has urged people to continue to support rural electrification. She was\n  speaking at an event last weekend regarding recent protests against the\n  scheme, following links between the introduction of electricity and the\n  disappearances of two young children. People have also been complaining of\n  health issues relating to electricity in their homes. She informed the\n  audience that the Gardaí and local health officials had completely ruled out\n  any such connections and that people who perpetuated these falsehoods were\n  doing damage to the local community. - ‘No link says ICA Chair’ An Iar-Nuacht\n  (30th April 1949) INFORMATION LEAFLET FROM THE ESB: A mass hysteria is a\n  collective obsessional behaviour where a group of people spontaneously\n  manifest similar hysterical symptoms. IT WILL NEVER STOP THEY WILL CONTINU TO\n  RUIN FAMILYS WE NEED TOO TAKE BACK CONTROL NO-ONE WILL HELP US WE AR ON ARE\n  OWN ‘I have not been able to sleep through the night since they put in the\n  electrics. It’s doing something to my brain. I feel groggy and tired all day.\n  My wife feels nauseous. She has had weakness in her limbs. She’s so weak some\n  days she can’t get out of bed. The doctor says he can do nothing for her.’\n  ‘It’s clear that we’re not being told all the facts. Now I know there’s been\n  talk of monsters. I’m an educated man. I don’t believe in monsters. But I\n  can’t help but see a connection between these cables in our houses and the\n  disappearances of our children. There is something. There is something\n  affecting our children. Why aren’t the ESB answering our questions?’\n  Transcript of interview with Minister O’Reilly on Radio Éireann, 3rd May 1949:\n  Q: … Minister O’Reilly, these crimes have occurred in your own constituency.\n  are An Garda Síochána doing enough? A: Firstly, I want to say that I\n  completely understand the frustrations and the worry people are feeling as\n  regards these cases. I want to assure everyone that the Gardaí are doing the\n  best they can to get these two children back to their parents. I’m a parent\n  myself and… Q: But I mean realistically, and I don’t really want to say this,\n  but realistically what are the chances of the boys being returned to their\n  families safely? A: I’m not going to get into that kind of talk. We need to\n  think of the parents —some of whom will be listening to this. We need to think\n  of them and how we can support them… Q: But Minister, one arrest has been made\n  and that man was subsequently released. No other suspects. This man has now\n  died, and it seems now that the trail has run cold. Will we ever get an\n  answer? Gardaí say that further investigations are needed to establish whether\n  a man found in a ditch at the side of the road died from injuries due to a\n  hit-and-run. A post-mortem was carried out on Monday by the State Pathologist,\n  but the results have not yet been released. Gardaí are looking for any\n  witnesses who may have been travelling on the Old Road between the hours of\n  5:30am and 6:30am on the 23rd of April to come forward. - Radio Éireann (14th\n  July 1949) ‘I’m a farmer. I can see the benefits of electricity to my life,\n  but I don’t believe it is worth putting my young family at risk. Until we have\n  found out what has happened, all electricity to the village should be switched\n  off.’ ‘The important thing is to remain calm.’ First the lights went off. This\n  happened suddenly one evening a couple of days after a rowdy meeting in the\n  local hall. No kettles were boiled, and all electrical farming equipment was\n  stopped. Candles and matches and paraffin lamps were passed around. Nobody\n  outside of the village really noticed anything was amiss until the electricity\n  poles and cables started crashing down. Men were sent out to replace or repair\n  the poles, but they would just be torn down once more. The poles were cut down\n  and used for firewood. Ovens and dishwashers were hauled out of houses and\n  dumped in front of the ESB showroom. Door-to-door collections were made to\n  collect lightbulbs… - Duane, ibid. Transcript of recording made as part of a\n  local history project: … and things got very scary. The streetlights were\n  smashed. My father ripped the cables from the house and removed the hoover and\n  cooker. My parents didn’t want any hassle. … from the nuns in Italy who\n  believed they were cats and the dancing manias of the 12th century to the\n  small village in rural Ireland that refused electricity for fears of ‘monsters\n  in the cables’… - A Brief History of Madness, by Madeleine Heffernan (Tigh Uí\n  Dhrisceoil, 1987) ‘We had a glimpse of what life could be like. It was\n  fleeting. I tell my grandchildren about it, but they don’t believe it.’ The\n  washing machine is situated directly adjoining the sink so that the wringing\n  may be carried out without wetting the floor. They hold aloft their candles\n  and gas lamps —symbols of their revolt against what they believe is the\n  scourge of electricity. Some have called them Luddites; others have mocked\n  them for their supposedly backwards ways but none of that has stopped them.\n  They have remained steadfast in their belief. They are strong in their\n  principles in a way that very few people are these days and I have to say I\n  respect them for that. - ‘An Irishman’s Diary’ The Irish Times (1st August\n  1949) There were reports of at least two households who refused to stop using\n  electricity. They enjoyed the benefits that came with it and they did not want\n  to return to harder times. Local opinion of them was hostile. The thought that\n  they would be willing to put their children at risk for the sake of\n  convenience was too much for their neighbours. These families were forced out\n  of their homes, and effectively hounded out of the village. - Duane, ibid. The\n  electric cooker has been proved to be the cheapest method of preparing meals.\n  It is quick too b ecause of the speed-o-matic plates which are fitted to every\n  new cooker. Two men have been arrested on suspicion of setting fire to an ESB\n  showroom just outside of ______. The men were protesting the introduction of\n  electricity in the area. Gardaí are looking for witnesses to the incident. -\n  Radio Éireann (20th July 1949) And because he was a man, he tried to fix her:\n  he bought her things, he listened, he yelled at her, he brought her to a\n  doctor. He tried to change himself, tried to make himself into something new.\n  But nothing seemed to work. He could never make her whole again and so he\n  decided that instead he would create a life for them together: he found a\n  cottage by the beach and placed her there. He cooked for her, he held her, he\n  loved her, he married her. He kept others away. He made their lives together\n  as small as they could be. They were each other’s secret. They were cocooned.\n  Then came a brief flickering moment of joy: a baby came, and her belly grew.\n  And she was happy, and he marvelled at how happy she was until the blood came\n  and took the baby away. - Extract from This Gathering Light by Angela Czochara\n  (2006) MEMORANDUM FOR: ATTENTION OF THE MINISTER SUBJECT: RURAL\n  ELECTRIFICATION DATE:10th SEPTEMBER 1949 Across the country parishes lit up.\n  The lives of farmers and rural housewives improved dramatically in a short\n  space of time. No longer did water have to be drawn from a well and carried by\n  cart. No longer was cooking restricted to an open fire. By 1965, 80% of rural\n  households were connected to the electricity supply. - Swanzy, ibid. I live\n  with my mammy and daddy, my two sisters, and a dog called Rusty. I have been\n  in this new school for three months and I like it a lot and I have made lots\n  of friends. I do miss my old friends and my old school and the rocky place\n  where we would go and play. But here my room is bright and there aren’t\n  monsters and my mammy and daddy are happy. I liked my old home a lot but then\n  things were scary, and we had to come here. Everything is nice here. - Essay\n  by a child that formed part of an exhibition in the National Museum of Country\n  Life (March – October 2016) Local party members advise against the forced\n  introduction of electricity in the village of _____ in County ____. The\n  presence of the army will only exacerbate an already tense situation. A\n  representative from the ESB has also expressed concern for the wellbeing of\n  their employees if they are forced to work in the area. As you know there have\n  been reports of ESB workers being attacked, work gear being stolen, and a\n  display shop being set on fire. In loving memory of ____ who has been missing\n  from his home since 14th October 1948. Mammy and Daddy think about you every\n  day. Transcript of recording made as part of a local history project: … I\n  would tell Mammy I was going to stay with Máire and she would tell her mam\n  that she was staying with me and then we would go and stay with Davey’s\n  cousin. Davey was someone I knew from the village. His cousin lived in ______\n  and she had a record player and we listened to jazz records that her sister in\n  America sent her. And we would dance in her living room and her mother made us\n  a roast chicken dinner. With the switching on of electricity in the Black\n  Valley, Co. Kerry in June 1976, the whole of the island was finally\n  electrified. Except of course for one village which refused to be dragged into\n  the 20th century. It remains the only area in the country without electricity\n  to this day. - Swanzy, ibid. The Numbers The Electricity Supply Board was\n  established on 11 August 1927. 1 million poles, 100,000 transformers and\n  75,000 miles of line 300,000 homes connected. By 1946 the number of consumers\n  had reached 240,000 using 380 million units per annum. For decades the village\n  of ______ has been ridiculed for its refusal to be welcomed into the 20th—not\n  to mention 21st—century. However, the truth is altogether more worrying as the\n  team from Prime Time Investigates uncovered Monday night on RTÉ One. The\n  programme provided a rare insight into a people who have effectively closed\n  themselves off from the outside world. We are first introduced to Mary, a\n  pleasant woman in her late sixties who sees nothing wrong with the hard work\n  involved in washing, cleaning and cooking without electricity. She says she\n  was raised to work hard, and she sees no problem with it. We subsequently join\n  local men at a pub where they sing songs and tell stories and create their own\n  entertainment. They speak in an odd, old-fashioned dialect that marks them out\n  as different. It is a quaint kind of life and one that looks appealingly\n  nostalgic until we meet Neasa. Neasa grew up in the village and was subject to\n  physical abuse at the hands of her family. She escaped when she was 18 and has\n  never returned. For her it is not just about the electricity, she explains,\n  the darkness is a form of control. The village does not allow strangers to\n  stay long and they do not respect the authority of the Gardaí or the State. A\n  place where no light shines will always be ripe for abuse… ‘An Dorchadas/The\n  Darkness’, The Irish Times (15th December 2009) It has been now over 30 years\n  since two small boys vanished from their homes in ______. A recently formed\n  community group is staging a rally this lunchtime to commemorate the\n  disappearances. They will lay flowers at the locations the boys were last seen\n  —a bedroom, a front garden, a pavement—before continuing on to the local Garda\n  station. The Gardaí have responded to concerns by launching a renewed appeal\n  for information. The Garda Superintendent in charge of the investigation said\n  that the passage of time might have made some people more willing to come\n  forward with information. He reassured people that they will be treated\n  respectfully and discreetly. Anyone with information is asked to contact the\n  Garda Confidential Line. - ‘30th anniversary of disappearances’ The Irish\n  Examiner (October 1979) Proper lighting in the home or workshop is the best\n  guarantee of continued good eyesight for adults and children. The expectation\n  in official circles was that over time old superstitions would fade away, the\n  older generation would die off and electricity would be reintroduced without\n  incident. And yet the village remains in complete darkness to this very day.\n  Partly this is to do with geography— it is situated in an isolated rural\n  area—and partly it is due to a lack of financial support from the government.\n  When the local population started to rip out poles and cables, the ESB were\n  sent to restore the light, but their workers were attacked and abused. On the\n  completion of the rural electrification scheme, the government refused further\n  State funding for the area unless the locals agreed to allow electricity back\n  in their homes. They declined and the stalemate has continued ever since. -\n  Duane, ibid. The initial amusement and subsequent alarm of some public\n  servants in relation to a village in the West which had turned against the\n  rural electrification scheme has been revealed in the latest batch of state\n  documents released under the 30-year rule. Memos from the Department of Rural\n  Affairs reveal the dismissive attitude of civil servants towards the area. The\n  village had suffered several child abductions which were attributed to the\n  recently installed electricity cables. The villagers become increasingly\n  suspicious resulting in the tearing down of the electricity infrastructure.\n  Their belief was that there were ‘monsters’ in the electricity lines. - ‘State\n  papers: a round-up’ The Irish Examiner (27th December 1978) ‘I would do my\n  homework in the evening by lamplight. At school we had dry toilets that were\n  only flushed once a day.’ This is the last ever issue of the REO News and we\n  hope that you have gained some insight and support from what we have\n  published. - Editor’s Letter, REO News (vol. 168, November 1961) Looking for a\n  digital detox holiday on a budget? Then take a look at some of these amazing\n  properties in ______ in Ireland. Step back in time to a simpler era. The\n  entire village has no electricity which means you can have the opportunity to\n  switch off completely. Enjoy your dinner by paraffin lamp, practice\n  mindfulness while you wash clothes by hand, learn how to cook your food over\n  an open fire… - Article in The New York Times Travel Section, (7th June 2012)\n  Welcome to Fade Away, the podcast about people who have disappeared without\n  trace. In Season 1, we examined the case of Marcy Wainwright, a woman who one\n  day vanished from her factory job. In Season 2, we focused on the Clement\n  family, who haven’t been seen since Christmas Eve 1865. Now in Season 3, we\n  are looking into the alleged abductions of two children in… Intro to Fade\n  Away, August 2014 TO: info@fadeawaypodcast.com FROM: ------------------------\n  RE: PODCAST — INFO DATE: 29 Sept 2015, 13:47\n  ------------------------------------------- Hi, My name is I’ve just come\n  across your podcast and I think I might have some information for you. My\n  grandmother grew up in the village and she was there when the abductions took\n  place. She emigrated to Canada in the 60s. She never spoke about what happened\n  but after she died, we found some notes she had written which may be useful to\n  Gardaí have confirmed that they are pursuing several new leads of inquiry\n  following renewed interest in the cases arising out of a true-crime podcast\n  which has… - ‘Podcast leads to new avenues of inquiry’, An Iar Nuacht (23rd\n  November 2015) ‘This third season has been a real breakthrough for us. We got\n  good numbers and interaction for season one and two but this year things have\n  just gotten crazy,’ says Weeverman. And what does she say to critics who\n  accuse the true-crime podcast genre of unethical behaviour and exploitation.\n  ‘It’s something we are both very aware of. That’s part of the reason we chose\n  crimes that were committed at least a generation ago. We don’t want relatives\n  to be upset and having to read… ’ - Extract from interview with Harriet Gose\n  and Francine Weeverman, Flash Magazine (13th April 2015) … one of many who say\n  that this is a cover up. The police missed vital clues while neighbours looked\n  the other way. A lot of coincidences. What was really going on? I would\n  recommend everyone to read Satan in Ireland by JM Henry to learn more about\n  satanic groups that were… - Extract from blog entitled ‘The Disappearances\n  1948 - 49’ Discussion thread on Episode 6: What Did the Neighbours Know?\n  C_A_Dupin The problem the cops had was that they believed ‘everyone was at the\n  switching on’ so they never got a proper list of people together. And we all\n  know of course that Mrs Geary didn’t attend because she was feeling unwell and\n  so she went home by herself. And the O’Reillys didn’t attend either—were they\n  going to a wedding the next day or something… Like Dislike Comment Favourite\n  M4Murder But are we seriously suggesting that any of these people were\n  involved in the kidnapping of the first child? What’s the motive here? The\n  first child to me is the key becuase he was upstairs in his own bed. That’s\n  not a ‘by chance’ kidnapping. That was palnned. The switching on was the\n  opportunity they needed. Like Dislike Comment Favourite Hastings What about\n  the witness statement from Francis Byrne? She saw footsteps in her garden but\n  the police never took photos or imprints. Like Dislike Comment Favourite\n  ChndlerR1 [comment deleted] Like Dislike Comment Favourite C_A_Dupin\n  @ChndlerR1 This is a serious thread to discuss matters that arise in the\n  course of the podcast. That’s serious discussion only pertaining to the facts\n  of the case. If you want to speculate wildly there are plenty of other forums\n  for that. Like Dislike Comment Favourite M4Murder @Hastings Yeah, I thought\n  that was interesting too. Like, FB’s garden backed on to the victims so\n  someone could likely have escaped that way. They didn’t dwell on it on the pod\n  though so maybe they know more than they are letting on abot that right now.\n  Like Dislike Comment Favourite TruCrimFan Hi! new to the thread. I’m just\n  wondering what people feel about the parents. Am not talking shit I just am\n  genuinely wondering. It’s kind of like occam’s razor.a lot of the neighbors\n  seem to think that the house was a little dysfuntioncal. Maybe they were\n  abusing the kid or they killed him accidentally or something. The other\n  idnappings were a cover up. Again, please don’;t ban me. I really want to know\n  more. Like Dislike Comment Favourite C_A_Dupin @ TruCrimFan There are threads\n  about the parents. Check out the search bar. Like Dislike Comment Favourite\n  Reviewers have often suggested illusions in his music to PJ Harvey, Steely Dan\n  and Captain Beefheart, but all of this was news to the young Sammy Lynch. He\n  had never heard of any of these artists. He grew up in a tiny village in the\n  West of Ireland without electricity and therefore no record players, no radios\n  and no internet. He had grown up with music, of course, but it was all\n  traditional melodies and songs that had been written hundreds of years prior.\n  For his twelfth birthday he asked for a guitar and started immediately to\n  write his own weird little songs. -'Darkness into Light' by Oliver Rapid,\n  PPOPP Magazine (Issue 381) … a link in the minds of many people even today\n  between the erection of electricity poles and the disappearance of fairies,\n  banshees, leprechauns. Maybe their homes were indeed disturbed by workers or\n  perhaps this is just a metaphor for… - ‘The Last of the Fairies’ by Sam Beaton\n  Hibernian Monthly (vol 67, 3rd August 1998, p. 22 27) The Network Renewal Plan\n  began in the late 1990s to upgrade the electricity supply to reflect the needs\n  of modern Ireland. There remains a lot of interest from an anthropological\n  view as well. The village has retained many of the old methods and routines\n  that modernisation has swallowed up in the rest of the country. Old methods of\n  cooking have been preserved and farming practices from a bygone age remain\n  commonplace. Their isolation has preserved the village as if frozen in time.\n  Naw purteen narr honchee - Duane, ibid. Tch buteagh y ar maggee Fado al sunee\n  thist giy ar nournagh - Song written in the local dialect You Won’t Believe\n  These Places That Have No Electricity - Buzzfeed (March 2019) The link between\n  ‘screen time’ (short-wavelength, artificial blue light emitted from electronic\n  devices) and sleep disorders has been well established in several studies\n  (Delahunt et al., 2015; Brennan & Jones 2008; Parsons 2016). The comparisons\n  as set out in Graph 1b shows the differences in sleep quality between Group A\n  (control group) and Group B (digital natives) … - Comparative evaluation of\n  the health effects of technology between digital natives and digital naïfs,\n  Goetsmen & Waine (2017) On the way out of the village is a memorial to the two\n  children. It is well-kept and is always covered in flowers and teddy bears and\n  mass cards. - Cahalane, ibid. Mary Lane (1924 - 2020): Mary Lane worked as the\n  chief archivist for the ESB between 1966 and 1996. She trained initially as a\n  librarian and worked for a time for UCD before joining the ESB as assistant\n  archivist in 1945. On the retirement of her predecessor, she took over the\n  main role. John 1:5 And the light shineth in darkness; and the darkness\n  comprehended it not.";
    			attr_dev(div, "class", "text");
    			add_location(div, file$c, 5, 0, 106);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    		},
    		i: function intro(local) {
    			if (current) return;

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
    			if (detaching) detach_dev(div);
    			if (detaching && div_outro) div_outro.end();
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
    	validate_slots("Electric", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Electric> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ blur, linear: identity });
    	return [];
    }

    class Electric extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Electric",
    			options,
    			id: create_fragment$e.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.32.3 */
    const file$d = "src/App.svelte";

    // (29:6) <Link to="/info">
    function create_default_slot_9(ctx) {
    	let em;

    	const block = {
    		c: function create() {
    			em = element("em");
    			em.textContent = "About";
    			add_location(em, file$d, 28, 23, 970);
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
    		source: "(29:6) <Link to=\\\"/info\\\">",
    		ctx
    	});

    	return block;
    }

    // (33:4) <Route path="/the-conjuring">
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
    		source: "(33:4) <Route path=\\\"/the-conjuring\\\">",
    		ctx
    	});

    	return block;
    }

    // (34:4) <Route path="/only-just">
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
    		source: "(34:4) <Route path=\\\"/only-just\\\">",
    		ctx
    	});

    	return block;
    }

    // (35:4) <Route path="/butterfly">
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
    		source: "(35:4) <Route path=\\\"/butterfly\\\">",
    		ctx
    	});

    	return block;
    }

    // (36:4) <Route path="/saint-sisters">
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
    		source: "(36:4) <Route path=\\\"/saint-sisters\\\">",
    		ctx
    	});

    	return block;
    }

    // (37:4) <Route path="/a-scarf">
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
    		source: "(37:4) <Route path=\\\"/a-scarf\\\">",
    		ctx
    	});

    	return block;
    }

    // (38:4) <Route path="/getting-the-electric">
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
    		source: "(38:4) <Route path=\\\"/getting-the-electric\\\">",
    		ctx
    	});

    	return block;
    }

    // (39:4) <Route path="/info">
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
    		source: "(39:4) <Route path=\\\"/info\\\">",
    		ctx
    	});

    	return block;
    }

    // (40:4) <Route>
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
    		source: "(40:4) <Route>",
    		ctx
    	});

    	return block;
    }

    // (21:0) <Router {url}>
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
    			attr_dev(div, "class", "overlay svelte-ksismw");
    			add_location(div, file$d, 22, 2, 745);
    			attr_dev(a0, "href", "/");
    			attr_dev(a0, "class", "title-link svelte-ksismw");
    			add_location(a0, file$d, 24, 4, 800);
    			add_location(em, file$d, 26, 18, 895);
    			attr_dev(a1, "href", "/");
    			add_location(a1, file$d, 26, 6, 883);
    			add_location(span, file$d, 27, 6, 920);
    			attr_dev(nav, "class", "header-menu");
    			add_location(nav, file$d, 25, 4, 851);
    			attr_dev(header, "id", "app-header");
    			attr_dev(header, "class", "svelte-ksismw");
    			add_location(header, file$d, 23, 2, 771);
    			attr_dev(main, "class", "svelte-ksismw");
    			add_location(main, file$d, 31, 2, 1017);
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
    			const link_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				link_changes.$$scope = { dirty, ctx };
    			}

    			link.$set(link_changes);
    			const route0_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				route0_changes.$$scope = { dirty, ctx };
    			}

    			route0.$set(route0_changes);
    			const route1_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				route1_changes.$$scope = { dirty, ctx };
    			}

    			route1.$set(route1_changes);
    			const route2_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				route2_changes.$$scope = { dirty, ctx };
    			}

    			route2.$set(route2_changes);
    			const route3_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				route3_changes.$$scope = { dirty, ctx };
    			}

    			route3.$set(route3_changes);
    			const route4_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				route4_changes.$$scope = { dirty, ctx };
    			}

    			route4.$set(route4_changes);
    			const route5_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				route5_changes.$$scope = { dirty, ctx };
    			}

    			route5.$set(route5_changes);
    			const route6_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				route6_changes.$$scope = { dirty, ctx };
    			}

    			route6.$set(route6_changes);
    			const route7_changes = {};

    			if (dirty & /*$$scope*/ 2) {
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
    		source: "(21:0) <Router {url}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$f(ctx) {
    	let router;
    	let t;
    	let footer;
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
    			t = space();
    			footer = element("footer");
    			attr_dev(footer, "class", "svelte-ksismw");
    			add_location(footer, file$d, 43, 0, 1435);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(router, target, anchor);
    			insert_dev(target, t, anchor);
    			insert_dev(target, footer, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const router_changes = {};
    			if (dirty & /*url*/ 1) router_changes.url = /*url*/ ctx[0];

    			if (dirty & /*$$scope*/ 2) {
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
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(footer);
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
    	validate_slots("App", slots, []);
    	let { url } = $$props;

    	onMount(() => {
    		navigate(window.location.pathname, { replace: true });
    	});

    	const writable_props = ["url"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("url" in $$props) $$invalidate(0, url = $$props.url);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
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
    		url
    	});

    	$$self.$inject_state = $$props => {
    		if ("url" in $$props) $$invalidate(0, url = $$props.url);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [url];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, { url: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$f.name
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

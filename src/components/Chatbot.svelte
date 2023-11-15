<!-- App.svelte -->
<script>

    import {onMount} from "svelte";

    const options = {
        method: 'POST',
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            versionID: "production",
            Authorization: "VF.DM.654e90025605a20007a61c89.zbPoZtx6lhQVRnPy"
        },
        body: JSON.stringify({
            action: {type: 'launch'},
            config: {
                tts: false,
                stripSSML: true,
                stopAll: true,
                excludeTypes: ['block', 'debug', 'flow']
            }
        })
    };

    export let baumhoehe;
    export let baumart;
    export let kronendurchmesser;

    let user_id;

    let messages = [];
    let newMessage = '';
    let chatAvailable = false;

    const startConversation = async () => {
        user_id = crypto.randomUUID();

        await fetch('https://general-runtime.voiceflow.com/state/user/' + user_id + '/variables?logs=off', {
            ...options, method: "PATCH", body: JSON.stringify({
                baumhoehe, baumart, kronendurchmesser
            })
        })
            .then(response => response.json())
            .then(response => console.log("after setting variables", response))
            .catch(err => console.log("after setting variables error", err))
        await fetch('https://general-runtime.voiceflow.com/state/user/' + user_id + '/interact?logs=off', options)
            .then(response => response.json())
            .then(response => {
                console.log("Start interaction", response)
                response.filter(m => m.type === "text").forEach(msg => {
                    messages = [...messages, {text: msg.payload.message, type: "text", sender: 'bot'}];
                })
                chatAvailable = true;
                console.log(messages);
            })
            .catch(err => console.error("after start interaction error", err));
    }

    const sendMessage = async (userShownMessage, sentMessage) => {
        messages = [...messages, {text: userShownMessage, type: "text", sender: 'user'}];
        await fetch('https://general-runtime.voiceflow.com/state/user/' + user_id + '/interact?logs=off', {
            ...options, body: JSON.stringify({
                action: {type: 'text', payload: sentMessage}
            })
        })
            .then(response => response.json())
            .then(response => {
                console.log("Send Message response", response)
                let totalDelay = 0;
                response.forEach(msg => {
                    if (msg.payload && msg.payload.delay) {
                        totalDelay += msg.payload.delay;
                        console.log("total delay", totalDelay, msg);
                    }
                    setTimeout(() => {
                        switch (msg.type) {
                            case "text":
                                messages = [...messages, {text: msg.payload.message, type: "text", sender: 'bot'}];
                                break;
                            case "choice":
                                messages = [...messages, {
                                    text: "Wähle eine Option aus:",
                                    type: "small",
                                    sender: 'bot'
                                }, ...msg.payload.buttons.map(b => {
                                    return {
                                        label: b.request.payload.intent.name,
                                        text: b.name,
                                        type: "choice",
                                        sender: 'bot'
                                    }
                                })];
                                console.log("all choices appended", messages);
                                scrollToBottom();
                                break;
                            case "visual":
                                messages = [...messages, {
                                    text: "Grafik",
                                    type: "visual",
                                    sender: "bot",
                                    source: msg.payload.image
                                }]
                                break;
                            case "end":
                                chatAvailable = false;
                                break;
                        }
                        scrollToBottom();
                    }, totalDelay);
                })
                setTimeout(scrollToBottom, totalDelay + 100);
                newMessage = ''; // Clear the input field
                console.log(messages)
            })
            .catch(err => console.error("after start interaction error", err));
    }

    onMount(() => {
        const go = async () => {
            startConversation();
        }
        go();
    });

    const removeChatbox = (e) => {
        let overlay = document.getElementById("chatbot");
        let parent = overlay.parentElement;
        parent.removeChild(overlay);
    }

    function scrollToBottom() {
        const chatContainer = document.getElementById('chat-messages-wrapper');
        chatContainer.scrollTo({top: chatContainer.scrollHeight, behavior: "smooth"});
    }

    // Function to handle the enter key in the input field
    function handleKeydown(event) {
        if (event.key === 'Enter' && newMessage !== '') {
            sendMessage(newMessage, newMessage);
        }
    }


</script>

<style>
    #chat-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 1000;
    }

    #chat-container {
        z-index: 1001;
        background: #eee;
        display: flex;
        flex-direction: column;
        height: calc(100% - 20px);
        width: calc(100vw - 20px);
        position: fixed;
        top: 0;
        border: 1px solid #2A2B2A;
        border-radius: 5px;
        margin: 10px;
    }

    .message-wrapper {
        display: flex;
        flex-direction: row;
    }

    .message-wrapper-user {
        justify-content: flex-end;
    }

    .message {
        margin-bottom: 10px;
        padding: 8px;
        border-radius: 5px;
        max-width: 70%;
        text-align: left;
    }

    .user-message {
        background-color: #ddd;
        align-self: flex-end;
        color: #333;

    }

    .bot-message {
        background-color: #053B06;
        color: #fff;
        align-self: flex-start;
    }

    .close-chat {
        display: flex;
        flex-direction: row;
        justify-content: end;
        margin: 10px;
        color: #333;
        box-sizing: border-box;
    }

    .close-chat #close-button {
        width: 20px;
        height: 20px;
        cursor: pointer;
    }

    .chat-messages-wrapper {
        flex-grow: 1;
        overflow-y: auto;
        flex-direction: column;
        justify-content: flex-end;
        margin: 0 10px;
    }

    .new-chat-messages {
        display: flex;
        margin: 10px;
        box-sizing: border-box;
        flex-direction: row;
        flex-shrink: 1;
    }

    .new-chat-messages input {
        background: #ddd;
        border: none;
        color: #000;
    }

    .new-chat-messages input::placeholder {
        color: #333;
    }

    .new-chat-messages button {
        background-color: transparent;
        color: #000;
        border: none;
    }

    .new-chat-messages button svg {
        width: 24px;
        height: 24px;
        color: #000;
    }

    .new-chat-messages-wrapper {
        display: flex;
        width: 100%
    }

    .new-chat-messages-wrapper input {
        display: flex;
        flex-grow: 1;
        padding: 8px;
        box-sizing: border-box;
        border: 1px solid #ccc;
        border-radius: 5px;
    }

    .new-chat-messages-wrapper button {
        margin-left: -40px;
        padding: 8px;
        cursor: pointer;
    }


    .message-small {
        background-color: transparent;
        padding-bottom: 0;
        margin-bottom: 10px;
        color: #333;
        font-size: 0.8em;
    }

    .message-img {
        align-self: flex-start;
        max-width: 90%;
        margin-bottom: 10px;
        padding: 8px;
        border-radius: 5px;
    }


</style>

<div id="chat-overlay">
    <div id="chat-container">
        <div class="close-chat">
            <svg id="close-button" on:click={removeChatbox} on:keypress={removeChatbox}
                 xmlns="http://www.w3.org/2000/svg"
                 fill="000" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                 class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
        </div>
        <div class="chat-messages-wrapper" id="chat-messages-wrapper">
            {#each messages as {text, label, type, sender, source}}
                <div class="message-wrapper {sender === 'user' ? 'message-wrapper-user' : ''}">
                    {#if type === "choice"}
                        <button class="message {sender === 'user' ? 'user-message' : 'bot-message'}"
                                on:click={(e) => {sendMessage(text, label)}}>
                            {#if sender === "bot" && text === "Gesundheits-Check"}
                                🌡️
                            {:else if sender === "bot" && text === "Wasserbedarf"}
                                💧
                            {:else if sender === "bot" && text === "Bauminfos"}
                                🌳
                            {/if}
                            {text}
                        </button>
                    {:else if type === "text"}
                        <div class="message {sender === 'user' ? 'user-message' : 'bot-message'} message-normal">
                            {text}
                        </div>
                    {:else if type === "small"}
                        <div class="message {sender === 'user' ? 'user-message' : 'bot-message'} message-small">{text}</div>
                    {:else if type === "visual"}
                        <div class="message-img {sender === 'user' ? 'user-message' : 'bot-message'}
                    {type === 'small' ? 'message-small' : 'message-normal'}"><img class="message-img" src="{source}"
                                                                                  alt="grafik Regenmenge"></div>
                    {/if}
                </div>
            {/each}
        </div>

        <div class="new-chat-messages">
            <div class="new-chat-messages-wrapper">
                <input
                        disabled='{!chatAvailable}'
                        bind:value={newMessage}
                        placeholder={chatAvailable ? "Schreibe deine Nachricht..." : "Chat beendet."}
                        on:keydown={handleKeydown}/> <!-- Added keydown event listener -->
                <button
                        disabled='{!chatAvailable}'
                        on:click={(e) => {
                            if (newMessage !== '') {
                                sendMessage(newMessage, newMessage)
                            }
                        }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                         stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round"
                              d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"/>
                    </svg>

                </button>
            </div>
        </div>
    </div>
</div>



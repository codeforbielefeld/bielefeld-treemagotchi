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
                    messages = [...messages, {text: msg.payload.message, sender: 'bot'}];
                })
                chatAvailable = true;
            })
            .catch(err => console.error("after start interaction error", err));
    }

    const sendMessage = async (userShownMessage, sentMessage) => {
        messages = [...messages, {text: userShownMessage, sender: 'user'}];
        await fetch('https://general-runtime.voiceflow.com/state/user/' + user_id + '/interact?logs=off', {
            ...options, body: JSON.stringify({
                action: {type: 'text', payload: sentMessage}
            })
        })
            .then(response => response.json())
            .then(response => {
                console.log("Send Message response", response)
                response.forEach(msg => {
                    switch (msg.type) {
                        case "text":
                            messages = [...messages, {text: msg.payload.message, type: "text", sender: 'bot'}];
                            break;
                        case "choice":
                            messages = [...messages, {text: "Wähle eine Option aus:", type: "small", sender: 'bot'}]
                            messages = [...messages, ...msg.payload.buttons.map(b => {
                                return {label: b.request.payload.intent.name, text: b.name, type: "choice", sender: 'bot'}
                            })]
                            break;
                        case "visual":
                          messages = [...messages, {text: "Grafik", type: "visual", sender: "bot", source: msg.payload.image}]
                          break;
                        case "end":
                            chatAvailable = false;
                            break;
                    }
                    scrollToBottom();
                })
                setTimeout(scrollToBottom, 200);
                newMessage = ''; // Clear the input field
            })
            .catch(err => console.error("after start interaction error", err));
    }

    onMount(() => {
        const go = async () => {
            startConversation();
        }
        go();
    });

    function scrollToBottom() {
        const chatContainer = document.getElementById('chat-messages-wrapper');
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    // Function to handle the enter key in the input field
    function handleKeydown(event) {
        if (event.key === 'Enter') {
            sendMessage(newMessage, newMessage);
        }
    }


</script>

<style>
    @media only screen and (max-width:599px) {
        #chat-container {
            z-index: 1000;
            background: #eee;
            display: flex;
            flex-direction: column;
            height: 100vh;
            width: 100vw;
            position: fixed;
            top: 0;
            border: 1px solid #2A2B2A;
            padding: 10px;
        }

        .chat-messages-wrapper {
            flex-grow: 1;
            overflow-y: auto;
            flex-direction: column;
            justify-content: flex-end;
        }

        .new-chat-messages {
            display: flex;
            padding: 10px;
            margin: 10px;
            flex-direction: row;
            flex-shrink: 1;
        }
    }


    .message {
        margin-bottom: 10px;
        padding: 8px;
        border-radius: 5px;
        max-width: 70%;
        text-align: left;
    }

    .user-message {
        background-color: #B4F8B5;
        align-self: flex-end;

    }

    .bot-message {
        background-color: #053B06;
        align-self: flex-start;
    }

    .message-small {
        background-color: transparent;
        color: #333;
    }

    .message-img{
      align-self: flex-start;
      max-width: 90%;
      margin-bottom: 10px;
      padding: 8px;
      border-radius: 5px;
   }

    input {
        width: calc(100% - 20px);
        padding: 8px;
        margin-right: 10px;
        border: 1px solid #ccc;
        border-radius: 5px;
    }

    button {
        padding: 8px;
        border: 1px solid #ccc;
        border-radius: 5px;
        cursor: pointer;
    }
</style>

<div id="chat-container">
    <div class="chat-messages-wrapper" id="chat-messages-wrapper">
        <div>
            {#each messages as {text, label, type, sender, source}}
                {#if type === "choice"}
                    <button class="message {sender === 'user' ? 'user-message' : 'bot-message'}" on:click={(e) => {sendMessage(text, label)}}>{text}</button>
                {:else if type === "text"}
                    <div class="message {sender === 'user' ? 'user-message' : 'bot-message'} {type === 'small' ? 'message-small' : 'message-normal'}">{text}</div>
                {:else if type === "visual"}
                <div class="message-img {sender === 'user' ? 'user-message' : 'bot-message'}
                {type === 'small' ? 'message-small' : 'message-normal'}"><img class="message-img" src="{source}" alt="grafik Regenmenge"></div>
                {/if}
            {/each}
        </div>
    </div>

    <div>
        <input 
            disabled='{!chatAvailable}' 
            bind:value={newMessage} 
            placeholder={chatAvailable ? "Schreibe deine Nachricht..." : "Chat beendet."} 
            on:keydown={handleKeydown} /> <!-- Added keydown event listener -->
        <button 
            disabled='{!chatAvailable}' 
            on:click={(e) => {sendMessage(newMessage, newMessage)}}>Send</button>
    </div>
</div>


<!-- App.svelte -->
<script>

  import { onMount } from "svelte";


  export let baumhoehe;
  export let baumart;
  export let kronendurchmesser;

  let user_id;

  const startConversation = async () => {
    user_id = crypto.randomUUID();
    const options = {
      method: 'POST',
      headers: {accept: 'application/json', 'content-type': 'application/json', Authorization: "VF.DM.654e90025605a20007a61c89.zbPoZtx6lhQVRnPy"},
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

    await fetch('https://general-runtime.voiceflow.com/state/user/'+ user_id + '/interact?logs=true', options)
      .then(response => response.json())
      .then(response => console.log("Start interaction", response))
      .catch(err => console.error("after start interaction error", err));

    await fetch('https://general-runtime.voiceflow.com/state/user/' + user_id + '/variables?logs=true', {...options, method: "PATCH", body: JSON.stringify({
      baumhoehe, baumart, kronendurchmesser
    })})
      .then(response => response.json())
      .then(response => console.log("after setting variables", response))
      .catch(err => console.log("after setting variables error", err))

  }


  onMount(() => {
    const go = async () => {
      startConversation();

    }
    go();
  });


    




  //UI Logic

    let messages = [];
    let newMessage = '';
  
    function sendMessage() {
      if (newMessage.trim() !== '') {
        messages = [...messages, { text: newMessage, type: 'user' }];
        newMessage = ''; // Clear the input field
        scrollToBottom();
        // Simulate bot response after a brief delay
        setTimeout(() => {
          messages = [...messages, { text: 'Bot response...', type: 'bot' }];
          scrollToBottom();
        }, 500);
      }
    }
  
    function scrollToBottom() {
      const chatContainer = document.getElementById('chat-container');
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  </script>

  <main>
    hallo!!!!
  </main>
  
  <style>
    #chat-container {
      height: 300px;
      overflow-y: auto;
      border: 1px solid #2A2B2A;
      padding: 10px;
      margin-bottom: 10px;
      display: flex;
      flex-direction: column;
    }
  
    .message {
      margin-bottom: 10px;
      padding: 8px;
      border-radius: 5px;
      max-width: 70%;
    }
  
    .user-message {
      background-color: #B4F8B5;
      align-self: flex-end;
    
    }
  
    .bot-message {
      background-color: #053B06;
      align-self: flex-start;
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
    {#each messages as { text, type }}
      <div class="message {type === 'user' ? 'user-message' : 'bot-message'}">{text}</div>
    {/each}
  </div>
  
  <div>
    <input bind:value={newMessage} placeholder="Type your message..." />
    <button on:click={sendMessage}>Send</button>
  </div>
  
document.addEventListener('DOMContentLoaded', () => {
    // Elementos del DOM
    const consoleElement = document.getElementById('console');
    const inputElement = document.getElementById('game-input');
    const submitButton = document.querySelector('.game__submit');

    // Estado del juego
    let currentPhase = 1;
    let gameCompleted = false;

    // Función para actualizar la barra de progreso
    const updateProgress = (phase) => {
        const progressBar = document.getElementById('game-progress');
        const levelIndicator = document.getElementById('current-level');
        
        // Actualizar el nivel actual
        levelIndicator.textContent = phase;
        
        // Actualizar la barra de progreso
        const progress = (phase / 3) * 100;
        progressBar.style.width = `${progress}%`;
        progressBar.textContent = `Nivel ${phase}/3`;
        
        // Cambiar el color según el nivel
        progressBar.className = 'progress-bar progress-bar-striped progress-bar-animated';
        switch(phase) {
            case 1:
                progressBar.classList.add('bg-primary');
                break;
            case 2:
                progressBar.classList.add('bg-info');
                break;
            case 3:
                progressBar.classList.add('bg-success');
                break;
        }
    };

    // Configuración de las fases del juego
    const phases = {
        1: {
            help: `<div class="help-content">
                    <h6 class="text-primary">📋 Comandos Disponibles - Nivel 1:</h6>
                    <ul>
                        <li><code>help</code> - Muestra esta ayuda</li>
                        <li><code>inspect</code> - Busca pistas en el código</li>
                        <li><code>verify [código]</code> - Verifica el código encontrado</li>
                        <li><code>clear</code> - Limpia la consola</li>
                    </ul>
                    <div class="alert alert-info">
                        <i class="bi bi-info-circle"></i> Tip: Las herramientas de desarrollo son tu mejor amigo
                    </div>
                  </div>`,
            inspect: `<div class="hint-message">
                        <i class="bi bi-search"></i> Hmm... quizás deberías inspeccionar el código fuente de la página...
                        <br>Especialmente la sección &lt;head&gt; 🔍
                      </div>`,
            verify: (code) => {
                if (code === 'h4ck3r_1n1t') {
                    currentPhase = 2;
                    updateProgress(2);
                    return "<span class='game-success'><i class='bi bi-unlock'></i> ¡Código correcto! Has desbloqueado el nivel 2.</span>";
                }
                return "<span class='game-error'><i class='bi bi-x-circle'></i> Código incorrecto. Sigue buscando...</span>";
            }
        },
        2: {
            help: `<div class="help-content">
                        <h6 class="text-info">📋 Comandos Disponibles - Nivel 2:</h6>
                        <ul>
                            <li><code>help</code> - Muestra esta ayuda</li>
                            <li><code>search</code> - Busca elementos ocultos</li>
                            <li><code>unlock [password]</code> - Desbloquea el siguiente nivel</li>
                            <li><code>clear</code> - Limpia la consola</li>
                        </ul>
                        <div class="alert alert-info">
                            <i class="bi bi-info-circle"></i> Tip: Usa 'unlock' con la contraseña que encuentres
                        </div>
                    </div>`,
            search: `<div class="hint-message">
                      <i class="bi bi-eye-slash"></i> Busca elementos ocultos en el DOM...
                      <br>Algunos elementos pueden estar con display: none 👀
                    </div>`,
            unlock: (password) => {
                if (password === 's3cur1ty_m4st3r') {
                    currentPhase = 3;
                    updateProgress(3);
                    return "<span class='game-success'><i class='bi bi-unlock'></i> ¡Nivel 2 completado! Último nivel desbloqueado.</span>";
                }
                return "<span class='game-error'><i class='bi bi-x-circle'></i> Contraseña incorrecta. Sigue buscando...</span>";
            }
        },
        3: {
            help: `<div class="help-content">
                    <h6 class="text-success">📋 Comandos Disponibles - Nivel Final:</h6>
                    <ul>
                        <li><code>help</code> - Muestra esta ayuda</li>
                        <li><code>finish [código]</code> - Completa el juego</li>
                        <li><code>clear</code> - Limpia la consola</li>
                    </ul>
                    <div class="alert alert-success">
                        <i class="bi bi-info-circle"></i> Tip: El código final está oculto en el footer de la página
                    </div>
                  </div>`,
                  
            finish: (code) => {
                    if (code === 'cyber_elite_2024') {
                        gameCompleted = true;
                        updateProgress(3);
                        
                        return `<div class="game-success text-center">
                                <h5>🎉 ¡Felicitaciones! 🎉</h5>
                                <p>Has completado el juego. Eres un verdadero hacker ético.</p>
                                <small>Usa 'clear' para reiniciar el juego</small>
                               </div>`;
                    }
                    return "<span class='game-error'><i class='bi bi-x-circle'></i> Código final incorrecto. ¡Estás cerca!</span>";
                }
        }
    };


    const printToConsole = (message, isCommand = false) => {
        const messageClass = isCommand ? 'game-input' : 'game-output';
        const messageDiv = document.createElement('div');
        messageDiv.className = messageClass;
        consoleElement.appendChild(messageDiv);
    
        if (!isCommand) {
            new Typed(messageDiv, {
                strings: [message],
                typeSpeed: 10,
                showCursor: false,
                onComplete: () => {
                    consoleElement.scrollTop = consoleElement.scrollHeight;
                }
            });
        } else {
            messageDiv.innerHTML = `<span class="prompt">&gt;</span> ${message}`;
            consoleElement.scrollTop = consoleElement.scrollHeight;
        }
    };


    const handleCommand = (command) => {
        const args = command.split(' ');
        const mainCommand = args[0].toLowerCase();
        const parameter = args.slice(1).join(' ');
        const currentPhaseCommands = phases[currentPhase];


        if (gameCompleted && mainCommand !== 'clear') {
            printToConsole("<span class='game-warning'><i class='bi bi-trophy'></i> ¡Juego completado! Usa 'clear' para reiniciar.</span>");
            return;
        }

        switch (mainCommand) {
            case 'help':
                printToConsole(currentPhaseCommands.help);
                break;

                case 'clear':
                    consoleElement.innerHTML = '';
                    if (gameCompleted) {
                        currentPhase = 1;
                        gameCompleted = false;
                        updateProgress(1);
                        
                        printToConsole("🔄 Juego reiniciado. Escribe 'help' para comenzar.");
                    }
                break;

            case 'inspect':
                if (currentPhase === 1) {
                    printToConsole(currentPhaseCommands.inspect);
                } else {
                    printToConsole("<span class='game-error'><i class='bi bi-x-circle'></i> Comando no válido en esta fase.</span>");
                }
                break;

            case 'search':
                if (currentPhase === 2) {
                    printToConsole(currentPhaseCommands.search);
                } else {
                    printToConsole("<span class='game-error'><i class='bi bi-x-circle'></i> Comando no válido en esta fase.</span>");
                }
                break;

            case 'verify':
                if (currentPhase === 1 && parameter) {
                    printToConsole(currentPhaseCommands.verify(parameter));
                } else if (currentPhase === 2) {
                    printToConsole("<span class='game-error'><i class='bi bi-info-circle'></i> En el nivel 2 debes usar 'unlock' en lugar de 'verify'</span>");
                } else {
                    printToConsole("<span class='game-error'><i class='bi bi-exclamation-triangle'></i> Uso: verify [código]</span>");
                }
                break;

            case 'unlock':
                if (currentPhase === 2 && parameter) {
                    printToConsole(currentPhaseCommands.unlock(parameter));
                } else {
                    printToConsole("<span class='game-error'><i class='bi bi-exclamation-triangle'></i> Uso: unlock [password]</span>");
                }
                break;

            case 'finish':
                if (currentPhase === 3 && parameter) {
                    printToConsole(currentPhaseCommands.finish(parameter));
                } else {
                    printToConsole("<span class='game-error'><i class='bi bi-exclamation-triangle'></i> Uso: finish [código]</span>");
                }
                break;

            default:
                printToConsole("<span class='game-error'><i class='bi bi-x-circle'></i> Comando no reconocido. Escribe 'help' para ver los comandos disponibles.</span>");
        }
    };


    printToConsole(`
        <div class="welcome-message">
            <h4>🖥️ Terminal de Hackeo Ético v2.0</h4>
            <p>Bienvenido al desafío de hacking ético.</p>
            <p>Escribe <code>help</code> para ver los comandos disponibles.</p>
        </div>
    `);

   
    updateProgress(1);

    // Event Listeners
    inputElement.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            const command = inputElement.value.trim();
            if (command) {
                printToConsole(command, true);
                handleCommand(command);
                inputElement.value = '';
            }
        }
    });

    submitButton.addEventListener('click', () => {
        const command = inputElement.value.trim();
        if (command) {
            printToConsole(command, true);
            handleCommand(command);
            inputElement.value = '';
        }
    });

    // Easter Egg - Mensaje oculto en consola
    console.log("%c¡Has encontrado un mensaje secreto!", "color: #00ff00; font-size: 20px; font-weight: bold;");
    console.log("%cPero las verdaderas pistas están en el HTML 😉", "color: #00ff00;");
});
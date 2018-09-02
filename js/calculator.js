
const fullConfigContainer = '#fullConfig';

class calculator {

    constructor() {
        this.addListeners();
    }

    addListeners() {
        document.querySelector('#configCalulatorForm').addEventListener('submit', (e) => {

            e.preventDefault();

            //character config
            const characterConfig = {
                maxLevel: document.querySelector('#characterMaxLevel').value,
                startExperience: document.querySelector('#characterStartExperience').value,
                firstExperienceJump: document.querySelector('#characterFirstExperienceJump ').value,
                experienceMultiplier: document.querySelector('#characterExperienceMultiplier').value,
                engramStart: document.querySelector('#characterEngramStart').value,
                engramFrequency: document.querySelector('#characterEngramFrequency').value,
                engramMultiplier: document.querySelector('#characterEngramMultiplier').value
            };

            //dino config
            let dinoConfig = false;
            if (document.querySelector('#outputDino').checked) {
                dinoConfig = {
                    maxLevel: document.querySelector('#dinoMaxLevel').value,
                    startExperience: document.querySelector('#dinoStartExperience').value,
                    firstExperienceJump: document.querySelector('#dinoFirstExperienceJump ').value,
                    experienceMultiplier: document.querySelector('#dinoExperienceMultiplier').value
                };
            }

            this.generateFullConfig(characterConfig, dinoConfig);

        });
    }

    generateFullConfig(characterConfig, dinoConfig = false) {
        let configString = "[/script/shootergame.shootergamemode]\r\n";

        const characterCalculation = this.generateLevelsString(
            parseInt(characterConfig.maxLevel),
            parseInt(characterConfig.startExperience),
            parseInt(characterConfig.firstExperienceJump),
            parseFloat(characterConfig.experienceMultiplier)
        );

        configString += characterCalculation.outputString;
        configString += "\r\n";

        let dinoCalculation = {};
        if (dinoConfig !== false) {
            dinoCalculation = this.generateLevelsString(
                parseInt(dinoConfig.maxLevel),
                parseInt(dinoConfig.startExperience),
                parseInt(dinoConfig.firstExperienceJump),
                parseFloat(dinoConfig.experienceMultiplier)
            );

            configString += dinoCalculation.outputString;
            configString += "\r\n";
        }

        configString += this.generateEngramLines(
            characterConfig.maxLevel,
            characterConfig.engramStart,
            characterConfig.engramFrequency,
            characterConfig.engramMultiplier
        );

        configString += `OverrideMaxExperiencePointsPlayer=${characterCalculation.maxPoints}`;
        if (dinoConfig !== false) {
            configString += "\r\n";
            configString += `OverrideMaxExperiencePointsDino=${dinoCalculation.maxPoints}`;
        }


        document.querySelector(fullConfigContainer).innerText = configString;
        document.querySelector(fullConfigContainer).className = 'active';
    }

    generateEngramLines(maxLevel, current, frequency, multiplier) {
        let output = '';

        for(let i = 0; i <= maxLevel; i++) {
            if (i % frequency === 0 && i !== 0) {
                current = Math.round(current * multiplier);
            }
            output += `OverridePlayerLevelEngramPoints=${current}` + "\r\n";
        }

        return output;
    }

    generateLevelsString(maxLevel, currentExperience, firstJump, multiplier) {
        let outputString = 'LevelExperienceRampOverrides=(',
            maxPoints = currentExperience,
            previousExperience = currentExperience,
            lastJump = previousExperience;

        //first 2 levels are static mostly.
        outputString += `ExperiencePointsForLevel[0]=${currentExperience}`;
        currentExperience += firstJump
        outputString += `,ExperiencePointsForLevel[1]=${currentExperience}`;
        lastJump = currentExperience - previousExperience;


        for (let i = 2; i <= maxLevel; i++) {
            previousExperience = currentExperience;
            currentExperience += Math.round(lastJump * multiplier, 0);
            lastJump = currentExperience - previousExperience;

            outputString += `,ExperiencePointsForLevel[${i}]=${currentExperience}`;
            maxPoints = currentExperience;
        }


        outputString += ')';

        return {
            outputString: outputString,
            maxPoints: maxPoints
        };
    }
}

const calcInstance = new calculator();
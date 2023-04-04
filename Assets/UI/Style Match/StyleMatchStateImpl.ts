import {
  StyleMatchController,
  StyleMatchResultType,
  StyleMatchState,
} from './StyleMatchState';

export class StyleMatch_Start implements StyleMatchState {
  public get dialogue(): string {
    return 'ZM_StyleMatching_Question1';
  }

  public get selectionLabel1(): string {
    return 'ZM_StyleMatching_Answer1';
  }

  public get selectionLabel2(): string {
    return 'ZM_StyleMatching_Answer2';
  }

  HandleSelection(selection: number, controller: StyleMatchController): void {
    controller.Translate(
      selection === 0 ? new StyleMatch_E() : new StyleMatch_I(),
    );
  }
}

export class StyleMatch_E implements StyleMatchState {
  public get dialogue(): string {
    return 'ZM_StyleMatching_Question2';
  }

  public get selectionLabel1(): string {
    return 'ZM_StyleMatching_Answer3';
  }

  public get selectionLabel2(): string {
    return 'ZM_StyleMatching_Answer4';
  }

  HandleSelection(selection: number, controller: StyleMatchController): void {
    controller.Translate(
      selection === 0 ? new StyleMatch_EN() : new StyleMatch_ES(),
    );
  }
}

export class StyleMatch_ES implements StyleMatchState {
  public get dialogue(): string {
    return 'ZM_StyleMatching_Question3';
  }

  public get selectionLabel1(): string {
    return 'ZM_StyleMatching_Answer5';
  }

  public get selectionLabel2(): string {
    return 'ZM_StyleMatching_Answer6';
  }

  HandleSelection(selection: number, controller: StyleMatchController): void {
    controller.Translate(
      new StyleMatch_End1(selection === 0 ? 'ES_A' : 'ES_B'),
    );
  }
}

export class StyleMatch_EN implements StyleMatchState {
  public get dialogue(): string {
    return 'ZM_StyleMatching_Question3';
  }

  public get selectionLabel1(): string {
    return 'ZM_StyleMatching_Answer7';
  }

  public get selectionLabel2(): string {
    return 'ZM_StyleMatching_Answer8';
  }

  HandleSelection(selection: number, controller: StyleMatchController): void {
    controller.Translate(
      new StyleMatch_End1(selection === 0 ? 'EN_A' : 'EN_B'),
    );
  }
}

export class StyleMatch_I implements StyleMatchState {
  public get dialogue(): string {
    return 'ZM_StyleMatching_Question2';
  }

  public get selectionLabel1(): string {
    return 'ZM_StyleMatching_Answer3';
  }

  public get selectionLabel2(): string {
    return 'ZM_StyleMatching_Answer4';
  }

  HandleSelection(selection: number, controller: StyleMatchController): void {
    controller.Translate(
      selection === 0 ? new StyleMatch_IN() : new StyleMatch_IS(),
    );
  }
}

export class StyleMatch_IS implements StyleMatchState {
  public get dialogue(): string {
    return 'ZM_StyleMatching_Question3';
  }

  public get selectionLabel1(): string {
    return 'ZM_StyleMatching_Answer9';
  }

  public get selectionLabel2(): string {
    return 'ZM_StyleMatching_Answer10';
  }

  HandleSelection(selection: number, controller: StyleMatchController): void {
    controller.Translate(
      new StyleMatch_End1(selection === 0 ? 'IS_A' : 'IS_B'),
    );
  }
}

export class StyleMatch_IN implements StyleMatchState {
  public get dialogue(): string {
    return 'ZM_StyleMatching_Question3';
  }

  public get selectionLabel1(): string {
    return 'ZM_StyleMatching_Answer11';
  }

  public get selectionLabel2(): string {
    return 'ZM_StyleMatching_Answer12';
  }

  HandleSelection(selection: number, controller: StyleMatchController): void {
    controller.Translate(
      new StyleMatch_End1(selection === 0 ? 'IN_A' : 'IN_B'),
    );
  }
}

export class StyleMatch_End1 implements StyleMatchState {
  public constructor(private result: StyleMatchResultType) {}

  public get dialogue(): string {
    return 'ZM_StyleMatching_Question4';
  }

  public get selectionLabel1(): string {
    return 'ZM_StyleMatching_Answer13';
  }

  public get selectionLabel2(): string {
    return 'ZM_StyleMatching_Answer14';
  }

  HandleSelection(selection: number, controller: StyleMatchController): void {
    controller.Translate(new StyleMatch_End2(this.result));
  }
}

export class StyleMatch_End2 implements StyleMatchState {
  public constructor(private result: StyleMatchResultType) {}

  public get dialogue(): string {
    return 'ZM_StyleMatching_Question5';
  }

  public get selectionLabel1(): string {
    return 'ZM_StyleMatching_Answer15';
  }

  public get selectionLabel2(): string {
    return 'ZM_StyleMatching_Answer16';
  }

  HandleSelection(selection: number, controller: StyleMatchController): void {
    controller.Terminate(this.result);
  }
}

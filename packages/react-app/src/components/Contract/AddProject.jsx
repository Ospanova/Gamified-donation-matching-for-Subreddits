/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState } from "react";
import { BigNumber } from "@ethersproject/bignumber";
import { Row, Col, Input, Divider, Tooltip } from "antd";
import { Transactor } from "../../helpers";
import tryToDisplay from "./utils";
import styled from 'styled-components'

export default function AddProject({ isActive, openAddProjectForm, closeAddProjectForm, contractFunction, functionInfo, provider, gasPrice }) {
    const [form, setForm] = useState({});
    const [txValue, setTxValue] = useState();
    const [returnValue, setReturnValue] = useState();

    

    const tx = Transactor(provider, gasPrice);

    const handleUpdateForm = (event, name) => {
        const formUpdate = { ...form };
        formUpdate[name] = event.target.value;
        setForm(formUpdate);
    };
    
    if (!isActive) {
        return null;
    }

    const inputs = functionInfo.inputs.map(input => (
        <div style={{ margin: 2, width: 1000}}   >
            <Input
                size="large"
                placeholder={input.name}
                value={form[input.name]}
                onChange={e => handleUpdateForm(e, input.name)}
            />
        </div>
    ));

    const txValueInput = (
        <div style={{ margin: 2, width: 1000 }}>
            <Input
                placeholder="transaction value"
                onChange={e => setTxValue(e.target.value)}
                value={txValue}
                addonAfter={
                    <div>
                        <Row>
                            <Col span={40}>
                                <Tooltip placement="right" title={" * 10^18 "}>
                                    <div
                                        type="dashed"
                                        onClick={async () => {
                                            let floatValue = parseFloat(txValue)
                                            if (floatValue) setTxValue("" + floatValue * 10 ** 18);
                                        }}
                                    >
                                        ✳️
                  </div>
                                </Tooltip>
                            </Col>
                            <Col span={16}>
                                <Tooltip placement="right" title={"number to hex"}>
                                    <div
                                        type="dashed"
                                        onClick={async () => {
                                            setTxValue(BigNumber.from(txValue).toHexString());
                                        }}
                                    >
                                        #️⃣
                </div>
                                </Tooltip>
                            </Col>
                        </Row>
                    </div>
                }
            />
        </div>
    );

    if (functionInfo.payable) {
        inputs.push(txValueInput);
    }

    const buttonIcon = functionInfo.type === "call" ? "📡" : "💸";
    inputs.push(
        <div style={{ cursor: "pointer", margin: 2, width: 1000}}>
            <Input
                onChange={e => setReturnValue(e.target.value)}
                defaultValue=""
                value={returnValue}
                addonAfter={
                    <div
                        type="default"
                        onClick={async () => {
                            closeAddProjectForm();
                            console.log("CLICK");
                            const args = functionInfo.inputs.map(input => form[input.name]);

                            const overrides = {};
                            if (txValue) {
                                overrides.value = txValue; // ethers.utils.parseEther()
                            }

                            // console.log("Running with extras",extras)
                            const returned = await tx(contractFunction(...args, overrides));

                            const result = tryToDisplay(returned);

                            console.log("SETTING RESULT:", result);
                            setReturnValue(result);
                        }}
                    >
                        {buttonIcon}
                    </div>
                }
            />
        </div>,
    );

    return (
        <ModalContainer>
            <div className="container">
                <div className="row">
                    <div id="modal" style={{fontSize: 20}} className="col-8 mx-auto col-md-6 col-lg-4 text-center text-capitalize my-10">
                        Add Projects
                        <Row>
                            <Col span={40}>{inputs}</Col>
                        </Row>
                    </div>
                </div>
            </div>
        </ModalContainer>
    );
}

const ModalContainer = styled.div`
z-index: 9;
position: fixed;
top: 0;
left: 0;
right: 0;
bottom: 0;
background: rgba(0,0,0,0.3);
display: flex;
align-items: center;
justify-content: center;
#modal {
    background: white;
}
`;